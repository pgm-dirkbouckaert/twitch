import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'UserMeta',
  tableName: 'user_meta',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    firstname: {
      type: 'varchar',
    },
    lastname: {
      type: 'varchar',
    },
    username: {
      type: 'varchar',
      unique: true,
    },
    avatar: {
      type: 'varchar',
      nullable: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
  },
});
