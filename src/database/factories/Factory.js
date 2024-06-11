export default class Factory {
  constructor() {
    this.inserted = [];
    this.amount = 0;
  }

  async make() {
    throw new Error('Factory should contain a make method');
  }

  async makeMany(amount) {
    // while (this.inserted.length < amount) {
    //   await this.make();
    // }
    const promises = [];
    while (this.amount < amount) {
      promises.push(this.make());
      this.amount += 1;
    }
    await Promise.all(promises);
  }
}
