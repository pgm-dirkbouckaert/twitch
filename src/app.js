import * as dotenv from 'dotenv';
import express from 'express';
import { create } from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import swaggerUI from 'swagger-ui-express';
import hbsHelpers from './lib/hbsHelpers.js';
import { VIEWS_PATH } from './consts.js';
import AppDataSource from './lib/DataSource.js';
import readerRoutes from './routes/reader.js';
import accountRoutes from './routes/account.js';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';
import {
  handleLogin,
  handleLogout,
  handleRegister,
  showLogin,
  showRegister,
} from './controllers/auth.js';
import registerValidation from './middleware/validation/register.js';
import loginValidation from './middleware/validation/login.js';
import { isLoggedOut, jwtAuth } from './middleware/jwtAuth.js';
import swaggerDefinition from './docs/swagger.js';

/**
 * Init dotenv
 */
dotenv.config();

/**
 * Create Express app
 */
const app = express();

// Serve static assets
app.use(express.static('public'));

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use cookie parser
app.use(cookieParser());

// Use method override
app.use(methodOverride('_method'));

// Use swagger UI
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

// Only parse query parameters into strings, not objects
// https://masteringjs.io/tutorials/express/query-parameters
app.set('query parser', 'simple');

// Set up Handlebars
const hbs = create({
  helpers: hbsHelpers,
  extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);

/**
 * AUTHENTICATION ROUTES
 */
app.get('/register', isLoggedOut, showRegister);
app.post('/register', ...registerValidation, handleRegister, showRegister);
app.get('/login', isLoggedOut, showLogin);
app.post('/login', ...loginValidation, handleLogin, showLogin);
app.post('/logout', jwtAuth, handleLogout);

/**
 * READER ROUTES
 */
app.use('/', readerRoutes);

/**
 * ACCOUNT ROUTES
 */
app.use('/account', accountRoutes);

/**
 * DASHBOARD ROUTES (teacher and admin)
 */
app.use('/admin', adminRoutes);

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * Not Found routes
 */
app.get('*', (req, res) => {
  res.status(404).render('404', { layout: 'auth' });
});

/**
 * Init TypeORM
 */
if (process.env.NODE_ENV !== 'test') {
  try {
    const connection = await AppDataSource.initialize();
    if (!connection.isInitialized)
      console.error('Error during Data Source initialization');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }

  /**
   * Serve app
   */
  app.listen(process.env.PORT, () => {
    console.log(`App is running on http://localhost:${process.env.PORT}/.`);
  });
}

export default app;
