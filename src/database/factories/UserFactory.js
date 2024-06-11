import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import AppDataSource from '../../lib/DataSource.js';
import Factory from './Factory.js';

class UserFactory extends Factory {
  constructor() {
    super();
  }

  async make() {
    // Get random role
    const roleRepo = AppDataSource.getRepository('Role');
    const roles = await roleRepo.find({});
    if (roles.length === 0)
      throw new Error('No roles found. Run the role seeder first.');
    const role = roles[Math.floor(Math.random() * roles.length)];

    // Create user
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const user = {
      email: faker.internet.email(firstname, lastname),
      password: bcrypt.hashSync(faker.internet.password(8), 12),
      role: { id: role.id },
      usermeta: {
        firstname,
        lastname,
        username: faker.internet.userName(firstname, lastname),
        avatar: `https://ui-avatars.com/api/?name=${firstname}+${lastname}&size=128&background=random`,
      },
    };

    // Insert user
    const record = await this.insert(user);
    this.inserted.push(record);
  }

  async insert(user) {
    const userRepo = AppDataSource.getRepository('User');
    // Check if record exists
    const record = await userRepo.findOne({ where: { email: user.email } });
    if (record) return record;
    // If record doesn't exist, create it
    return userRepo.save(user);
  }
}

export default new UserFactory();
