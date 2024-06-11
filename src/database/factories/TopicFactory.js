import AppDataSource from '../../lib/DataSource.js';
import Factory from './Factory.js';
import { getSlug } from '../../lib/Utils.js';

class TopicFactory extends Factory {
  constructor() {
    super();
    this.topics = [
      { name: 'Java', slug: getSlug('Java'), icon: 'java.png' },
      {
        name: 'Javascript',
        slug: getSlug('Javascript'),
        icon: 'javascript.png',
      },
      { name: 'Python', slug: getSlug('Python'), icon: 'python.png' },
      { name: 'React JS', slug: getSlug('React JS'), icon: 'react.png' },
      { name: 'PHP', slug: getSlug('PHP'), icon: 'php.png' },
      { name: 'Laravel', slug: getSlug('Laravel'), icon: 'laravel.png' },
      { name: 'Express JS', slug: getSlug('Express JS'), icon: 'express.png' },
      { name: 'Node.js', slug: getSlug('Node.js'), icon: 'nodejs.png' },
      { name: 'Angular', slug: getSlug('Angular'), icon: 'angular.png' },
      {
        name: 'Django Python',
        slug: getSlug('Django Python'),
        icon: 'django.png',
      },
      { name: 'SQL', slug: getSlug('SQL'), icon: 'sql.png' },
      { name: 'Typeorm', slug: getSlug('Typeorm'), icon: 'typeorm.png' },
      { name: 'CSS', slug: getSlug('CSS'), icon: 'css.png' },
      { name: 'jQuery', slug: getSlug('CSS'), icon: 'jquery.png' },
      {
        name: 'Typescript',
        slug: getSlug('Typescript'),
        icon: 'typescript.png',
      },
      { name: 'HTML5', slug: getSlug('HTML5'), icon: 'html5.png' },
      { name: 'Vue.js', slug: getSlug('Vue.js'), icon: 'vuejs.png' },
      { name: 'Next.js', slug: getSlug('Next.js'), icon: 'nextjs.png' },
      { name: 'Craft CMS', slug: getSlug('Craft CMS'), icon: 'craft-cms.png' },
      { name: 'Bootstrap', slug: getSlug('Bootstrap'), icon: 'bootstrap.png' },
      { name: 'Tailwind', slug: getSlug('Tailwind'), icon: 'tailwind.png' },
      { name: 'SASS', slug: getSlug('SASS'), icon: 'sass.png' },
      { name: 'Bulma', slug: getSlug('Bulma'), icon: 'bulma.png' },
      { name: 'Gatsby JS', slug: getSlug('Gatsby JS'), icon: 'gatsby.png' },
      { name: 'Flask', slug: getSlug('Flask'), icon: 'flask.png' },
      {
        name: 'Ruby on rails',
        slug: getSlug('Ruby on rails'),
        icon: 'ruby-on-rails.png',
      },
      { name: 'Symfony', slug: getSlug('Symfony'), icon: 'symfony.png' },
      { name: 'Drupal', slug: getSlug('Drupal'), icon: 'drupal.png' },
      { name: 'Ember JS', slug: getSlug('Ember JS'), icon: 'ember.png' },
      { name: 'Meteor.js', slug: getSlug('Meteor.js'), icon: 'meteor.png' },
    ];
  }

  async make() {
    await this.makeMany();
  }

  async makeMany() {
    // for (const topic of this.topics) {
    //   const record = await this.insert(topic);
    //   this.inserted.push(record);
    // }
    const promises = [];
    for (const topic of this.topics) {
      promises.push(this.insert(topic));
    }
    const records = await Promise.all(promises);
    this.inserted.push(records);
  }

  async insert(topic) {
    const topicRepo = AppDataSource.getRepository('Topic');
    // Check if record exists
    const record = await topicRepo.findOne({ where: { name: topic.name } });
    if (record) return record;
    // If record doesn't exist, create it
    return topicRepo.save(topic);
  }
}

export default new TopicFactory();
