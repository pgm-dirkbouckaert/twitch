import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    label: {
      type: 'varchar',
    },
  },
  relations: {
    users: {
      target: 'User',
      type: 'one-to-many',
      inverseSide: 'role',
      cascade: true,
    },
  },
});
