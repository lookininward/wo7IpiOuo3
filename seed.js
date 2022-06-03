require("dotenv").config();

const demo = require("./back-end/demo");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

const seedDB = async () => {
  const [
    createDB,
    createUsersTable,
    createUsers,
    createThreadsTable,
    createThreads,
    createCommentsTable,
    createComments,
    createReplies,
  ] = Array(8).fill(true);
  await demo.setupDB(connection, {
    createDB,
    createUsersTable,
    createUsers,
    createThreadsTable,
    createThreads,
    createCommentsTable,
    createComments,
    createReplies,
  });
};

seedDB()
  .then(() => {
    console.log("Success: Database seeded");
    process.exit();
  })
  .catch((e) => console.log("Failed to seed db", e));
