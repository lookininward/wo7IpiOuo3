require("dotenv").config();

const demo = require("./demo");

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const sessionUser = demo.USERS[0];

const clearComments = async (comments) => {
  new Promise((resolve) =>
    connection.query(`DELETE FROM comments `, (_, result) => resolve(result))
  );
};

const getSessionUser = () =>
  new Promise((resolve) =>
    connection.query(
      `SELECT * FROM users WHERE id = ${sessionUser.id}`,
      (_, result) => resolve(result[0])
    )
  );

const getUser = (userId) =>
  new Promise((resolve) =>
    connection.query(`SELECT * FROM users WHERE id = ${userId}`, (_, result) =>
      resolve(result[0])
    )
  );

const getUserThreads = (userId) =>
  new Promise((resolve) =>
    connection.query(
      `SELECT * FROM threads WHERE user_id = ${userId}`,
      (_, result) => resolve(result)
    )
  );

const getThreadComments = (threadId) =>
  new Promise((resolve) =>
    connection.query(
      `SELECT * FROM comments WHERE thread_id = ${threadId} AND parent_id IS NULL`,
      (_, result) => resolve(result)
    )
  );

const getReplies = (commentId) =>
  new Promise((resolve) =>
    connection.query(
      `SELECT * FROM comments WHERE parent_id = ${commentId}`,
      (_, result) => resolve(result)
    )
  );

const getComment = (commentId) =>
  new Promise((resolve) =>
    connection.query(
      `SELECT * FROM comments WHERE id = ${commentId}`,
      (_, result) => resolve(result[0])
    )
  );

const addComment = ({ threadId, parentId, text }) =>
  new Promise((resolve) => {
    connection.query(
      `
        INSERT INTO
            comments (
                text,
                created_at,
                user_id,
                thread_id,
                parent_id,
                upvotes
            ) VALUES (
                "${text}",
                NOW(),
                ${sessionUser.id},
                ${threadId},
                ${parentId || null},
                '[]'
            )
        `,
      (_, result) => resolve(result)
    );
  });

// todo: do not add if userId is in upvotes array
const upvoteComment = (commentId) =>
  new Promise((resolve) => {
    connection.query(
      `
        UPDATE comments
        SET upvotes = JSON_ARRAY_APPEND(
            upvotes,
            '$',
            "${sessionUser.id}"
        )
        WHERE id = ${commentId}
        AND NOT JSON_CONTAINS(upvotes, "${sessionUser.id}")
      `,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        resolve(result);
      }
    );
  });

const removeCommentUpvote = (commentId) =>
  new Promise((resolve) => {
    connection.query(
      `
        UPDATE comments
        SET upvotes = JSON_REMOVE(
            upvotes,
            replace(JSON_SEARCH(upvotes, 'one', "${sessionUser.id}"),'"', '')
        )
        WHERE id = ${commentId}
      `,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        resolve(result);
      }
    );
  });

const mapComments = async (comments) =>
  await Promise.all(
    comments.map(async (comment) => {
      const commentUser = await getUser(comment.user_id);
      const replies = await getReplies(comment.id);
      const mappedReplies = await mapComments(replies);
      return {
        id: comment.id,
        user: commentUser,
        text: comment.text,
        time: dayjs(comment.created_at).fromNow(),
        replies: [...mappedReplies],
        upvotes: [...comment.upvotes],
      };
    })
  );

app.get("/", async (_, res) => {
  try {
    const sessionUser = await getSessionUser();
    const userThreads = await getUserThreads(sessionUser.id);
    const thread = userThreads[0]; // todo: handle multiple threads
    const threadComments = await getThreadComments(thread.id);
    const comments = await mapComments(threadComments);
    res.send(comments);
  } catch (e) {
    console.log("Failed to connect", e);
    res.send("Failed to connect");
  }
});

app.get("/user", async (_, res) => {
  try {
    const user = await getSessionUser();
    res.send(user);
  } catch (e) {
    console.log("Failed to retrieve session user", e);
    res.send("Failed to retrieve session user");
  }
});

app.post("/add-comment", async (req, res) => {
  const { threadId, parentId, text } = req.body;
  try {
    await addComment({ threadId, parentId, text });
    res.send("Added comment");
  } catch (e) {
    console.log("Failed to add comment", e);
    res.send("Failed to add comment");
  }
});

app.post("/upvote-comment", async (req, res) => {
  const { commentId } = req.body;
  const { upvotes } = await getComment(commentId);
  const hasUpvote = upvotes.some((id) => id === sessionUser.id.toString());

  if (!hasUpvote) {
    await upvoteComment(commentId);
  } else {
    await removeCommentUpvote(commentId);
  }

  res.send("success");
});

app.post("/reset", async (req, res) => {
  try {
    await clearComments();
    await demo.setupDB(connection, {
      createComments: true,
      createReplies: true,
    });
    res.send("Reset DB");
  } catch (e) {
    console.log("Failed to reset db", e);
    res.send("Failed to reset db");
  }
});

app.listen(port);
