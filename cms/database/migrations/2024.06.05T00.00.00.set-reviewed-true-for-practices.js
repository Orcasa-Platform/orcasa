'use strict'

async function up(knex) {
  await knex.from('practices').update({ reviewed: true });
}

module.exports = { up };
