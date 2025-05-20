exports.up = function(knex) {
  return knex.schema
    .createTable('polls', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('question').notNullable();
      table.timestamp('expires_at').notNullable();
      table.timestamps(true, true);
    })
    .createTable('options', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('poll_id').references('id').inTable('polls').onDelete('CASCADE');
      table.string('text').notNullable();
    })
    .createTable('votes', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('poll_id').references('id').inTable('polls').onDelete('CASCADE');
      table.uuid('option_id').references('id').inTable('options').onDelete('CASCADE');
      table.string('user_id').notNullable();
      table.unique(['poll_id', 'user_id']);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('votes')
    .dropTable('options')
    .dropTable('polls');
};
