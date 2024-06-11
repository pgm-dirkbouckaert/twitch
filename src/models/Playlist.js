import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Playlist',
  tableName: 'playlists',
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
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
    videos: {
      target: 'Video',
      type: 'many-to-many',
      joinTable: { name: 'playlist_video' },
      cascade: true,
      nullable: true,
    },
  },
});
