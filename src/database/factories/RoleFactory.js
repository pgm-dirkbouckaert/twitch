import AppDataSource from '../../lib/DataSource.js';
import Factory from './Factory.js';

class RoleFactory extends Factory {
  constructor() {
    super();
    this.roles = ['reader', 'teacher', 'admin'];
  }

  // Generate one
  async make() {
    await this.makeMany();
  }

  // Generate many
  async makeMany() {
    // for (const role of this.roles) {
    //   const record = await this.insert(role);
    //   this.inserted.push(record);
    // }
    const promises = [];
    for (const role of this.roles) {
      promises.push(this.insert(role));
    }
    const records = await Promise.all(promises);
    this.inserted.push(records);
  }

  // Insert in the database
  async insert(label) {
    const roleRepo = AppDataSource.getRepository('Role');
    // Check if record exists
    let record = await roleRepo.findOne({ where: { label } });
    if (record) return record;
    // Create record if it doesn't exist
    record = await roleRepo.save({ label });
    return record;
  }
}

export default new RoleFactory();
