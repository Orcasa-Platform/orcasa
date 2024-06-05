'use strict'

async function up(knex) {
  // Create the `reviewed` column as the migration is run before the table has been updated
  await knex.schema.alterTable('practices', (table) => {
    table.boolean('reviewed').defaultTo(false);
  });

  // Set the value to `true` for all the existing rows
  await knex.from('practices').update({ reviewed: true });
}

module.exports = { up };
