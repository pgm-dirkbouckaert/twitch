import 'dotenv/config';
import DatabaseSeeder from './DatabaseSeeder.js';
import entities from '../../models/index.js';
import {
  TopicFactory,
  RoleFactory,
  UserFactory,
  VideoFactory,
  PlaylistFactory,
} from '../factories/index.js';

/**
 * Log response
 */
const logResponse = (records) => {
  console.log(`${records.length} records inserted!`);
  console.log('Inserted records:', records);
};

/**
 * Init new database seeder
 */
const dbSeeder = new DatabaseSeeder(
  process.env.DATABASE_TYPE,
  process.env.DATABASE_URL,
  entities
);

/**
 * Run the seed command using the flags --factory and --amount
 * e.g. npm run seed --factory user --amount 1
 */
const args = process.argv.slice(2);
const [factory, amount = 1] = args;

switch (factory) {
  case 'topic':
    dbSeeder.run(TopicFactory).then((records) => logResponse(records));
    break;
  case 'role':
    dbSeeder.run(RoleFactory).then((records) => logResponse(records));
    break;
  case 'user':
    dbSeeder.run(UserFactory, amount).then((records) => logResponse(records));
    break;
  case 'video':
    dbSeeder.run(VideoFactory, amount).then((records) => logResponse(records));
    break;
  case 'playlist':
    dbSeeder
      .run(PlaylistFactory, amount)
      .then((records) => logResponse(records));
    break;
  default:
    break;
}
