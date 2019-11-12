const knex = require('knex')({
  client: 'postgresql',
  connection: 'postgres://6ar:6arpassword@localhost:5432/6ar'
});

knex('border_traffic_entry').then((entries: Record<string, unknown>[]) => {
  const recat = entries[0]['recorded_at'];
  const creat = entries[0]['created_at'];
  console.log(`Typeof ${recat instanceof Date} and ${typeof creat}`);
});
