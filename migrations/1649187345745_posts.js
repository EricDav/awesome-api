/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('posts', {
        id: 'id',
        name: {type: 'varchar(100)', notNull: true},
        title: { type: 'text', notNull: true },
        content: { type: 'text', notNull: true },
        createdAt: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
      })
      pgm.createTable('comments', {
        id: 'id',
        commentId: { type: 'integer', notNull: false },
        name: { type: 'varchar(1000)', notNull: true },
        postId: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'cascade',
        },
        content: { type: 'text', notNull: true },
        createdAt: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
    })
};

exports.down = pgm => {};
