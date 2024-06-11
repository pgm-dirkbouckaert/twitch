import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Topic',
  tableName: 'topics',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    slug: {
      type: 'varchar',
    },
    icon: {
      type: 'varchar',
    },
  },
  relations: {
    videos: {
      target: 'Video',
      type: 'one-to-many',
      inverseSide: 'topic',
      cascade: true,
    },
  },
});
