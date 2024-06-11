import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Video',
  tableName: 'videos',
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
    thumbnail: {
      type: 'varchar',
      nullable: true,
    },
    youtube_id: {
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
    topic: {
      target: 'Topic',
      type: 'many-to-one',
      joinColumn: { name: 'topic_id' },
      onDelete: 'CASCADE',
    },
    playlists: {
      target: 'Playlist',
      type: 'many-to-many',
      joinTable: { name: 'playlist_video' },
      cascade: true,
    },
    videostars: {
      target: 'Videostar',
      type: 'one-to-many',
      inverseSide: 'video',
      cascade: true,
    },
  },
});
