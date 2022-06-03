const USERS = [
  {
    id: 1,
    name: "Rob Hope",
    avatar: "rob",
  },
  {
    id: 2,
    name: "Sophie Brecht",
    avatar: "sophie",
  },
  {
    id: 3,
    name: "Sophie Brecht",
    avatar: "sophie",
  },
];

const setupDB = async (
  connection,
  {
    createDB,
    createUsersTable,
    createUsers,
    createThreadsTable,
    createThreads,
    createCommentsTable,
    createComments,
    createReplies,
  }
) => {
  if (createDB) {
    connection.query("CREATE DATABASE ghost");
  }

  if (createUsersTable) {
    const createUsersTableQuery = `
        CREATE TABLE users(
            id int NOT NULL auto_increment PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            avatar VARCHAR(500) NOT NULL
        )
    `;
    connection.query(createUsersTableQuery);
  }

  // add users to users table
  if (createUsers) {
    const createUsersQuery = `
        INSERT INTO users (
            id,
            name,
            avatar
        ) VALUES (
            1, 'Rob Hope', 'https://i.imgur.com/S05jusL.png'
        ),
        (
            2, 'Sophie Brecht', 'https://i.imgur.com/NQoLBaz.png'
        ),
        (
            3, 'James', 'https://i.imgur.com/Q5gVeyx.png'
        ),
        (
            4, 'Cameron Lawrence', 'https://i.imgur.com/fAcyg0e.png'
        )
    `;
    connection.query(createUsersQuery);
  }

  if (createThreadsTable) {
    const createThreadsTableQuery = `
        CREATE TABLE threads(
            id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL,
            user_id int NOT NULL,
            constraint user_id FOREIGN KEY (id) REFERENCES users(id)
        )
    `;
    connection.query(createThreadsTableQuery);
  }

  // add threads to threads table
  if (createThreads) {
    const createThreadsQuery = `
        INSERT INTO threads (
            title,
            created_at,
            user_id
  
        ) VALUES (
            'A New Way of Communicating',
            NOW(),
            1
  
        )
    `;
    connection.query(createThreadsQuery);
  }

  if (createCommentsTable) {
    const createCommentTableQuery = `
        CREATE TABLE comments(
            id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(1000) NOT NULL,
            created_at DATETIME NOT NULL,
  
            user_id int NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
  
            thread_id int NOT NULL,
            FOREIGN KEY (thread_id) REFERENCES threads(id),
  
            parent_id int,
  
            upvotes JSON NOT NULL
        )
    `;
    connection.query(createCommentTableQuery);
  }

  // add comments to comments table
  if (createComments) {
    const createCommentsQuery = `
      INSERT INTO
          comments (
              id,
              text,
              created_at,
              user_id,
              thread_id,
              upvotes
          ) VALUES (
              1,
              "Jeepers now that's a huge release with some big community earnings to back it - it must be so rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
              NOW(),
              1,
              1,
              '[]'
          ),
          (
              2,
              "Switched our blog from Hubspot to Ghost a year ago -- turned out to be a great decision. Looking forward to this update....the in-platform analytics look especially delicious. :)",
              NOW(),
              2,
              1,
              '[]'
          ),
          (
              3,
              "Love the native memberships and the zipless themes, I was just asked by a friend about options for a new site, and I think I know what I'll be recommending then...",
              NOW(),
              4,
              1,
              '[]'
          );
      `;
    connection.query(createCommentsQuery);
  }

  // add replies to comments table
  if (createReplies) {
    const createRepliesQuery = `
      INSERT INTO comments (
          id,
          text,
          created_at,
          user_id,
          thread_id,
          parent_id,
          upvotes
      ) VALUES (
          4,
          "Thanks Sophie! Last year has been an absolute goldrush for the creator economy. Slowly at first, then all at once. Will be interesting to see how this ecosystem evolves over the next few years",
          NOW(),
          3,
          1,
          2,
          '[]'
      );
    `;
    connection.query(createRepliesQuery);
  }
};

module.exports = {
  USERS,
  setupDB,
};
