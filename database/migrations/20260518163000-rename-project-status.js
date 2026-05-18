'use strict';

const TABLE_NAME = 'projects';
const OLD_COLUMN = 'status';
const NEW_COLUMN = 'project_status';

async function hasTable(knex) {
  return knex.schema.hasTable(TABLE_NAME);
}

async function hasColumn(knex, columnName) {
  return knex.schema.hasColumn(TABLE_NAME, columnName);
}

module.exports = {
  async up(knex) {
    const tableExists = await hasTable(knex);
    if (!tableExists) {
      return;
    }

    const hasOldColumn = await hasColumn(knex, OLD_COLUMN);
    let hasNewColumn = await hasColumn(knex, NEW_COLUMN);

    if (!hasOldColumn) {
      return;
    }

    if (!hasNewColumn) {
      await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string(NEW_COLUMN);
      });
      hasNewColumn = true;
    }

    if (!hasNewColumn) {
      return;
    }

    await knex(TABLE_NAME)
      .whereIn(OLD_COLUMN, ['live', 'in-progress', 'inProgress', 'archived'])
      .update({
        [NEW_COLUMN]: knex.raw(
          `CASE WHEN ?? = ? THEN ? ELSE ?? END`,
          [OLD_COLUMN, 'in-progress', 'inProgress', OLD_COLUMN],
        ),
      });
  },

  async down(knex) {
    const tableExists = await hasTable(knex);
    if (!tableExists) {
      return;
    }

    const hasOldColumn = await hasColumn(knex, OLD_COLUMN);
    const hasNewColumn = await hasColumn(knex, NEW_COLUMN);

    if (!hasOldColumn || !hasNewColumn) {
      return;
    }

    await knex(TABLE_NAME)
      .whereIn(NEW_COLUMN, ['live', 'inProgress', 'archived'])
      .update({
        [OLD_COLUMN]: knex.raw(
          `CASE WHEN ?? = ? THEN ? ELSE ?? END`,
          [NEW_COLUMN, 'inProgress', 'in-progress', NEW_COLUMN],
        ),
      });
  },
};
