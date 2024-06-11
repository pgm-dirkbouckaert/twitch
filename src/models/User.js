import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
  },
  relations: {
    role: {
      target: 'Role',
      type: 'many-to-one',
      joinColumn: { name: 'role_id' },
      onDelete: 'CASCADE',
    },
    usermeta: {
      target: 'UserMeta',
      type: 'one-to-one',
      inverseSide: 'user',
      cascade: true,
    },
    videos: {
      target: 'Video',
      type: 'one-to-many',
      inverseSide: 'user',
      cascade: true,
    },
    videostars: {
      target: 'Videostar',
      type: 'one-to-many',
      inverseSide: 'user',
      cascade: true,
    },
    playlists: {
      target: 'Playlist',
      type: 'one-to-many',
      inverseSide: 'user',
      cascade: true,
    },
  },
});
