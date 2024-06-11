import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Videostar',
  tableName: 'videostars',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    created_at: {
      createDate: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
    video: {
      target: 'Video',
      type: 'many-to-one',
      joinColumn: { name: 'video_id' },
      onDelete: 'CASCADE',
    },
  },
});
