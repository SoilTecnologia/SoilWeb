import knex from '@root/database';

module.exports = async function seedTestDatabase() {
  try {
    await knex.raw('DROP DATABASE IF EXISTS soildb;');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
