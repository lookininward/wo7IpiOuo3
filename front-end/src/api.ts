import axios from "axios";

export const getUser = async () => {
  try {
    const { data: user } = await axios.get(
      `${process.env.REACT_APP_API_URL}/user`
    );
    return user;
  } catch (e) {
    console.error("failed to get user", e);
  }
};

export const getComments = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
    const { data: comments } = response;
    return comments;
  } catch (e) {
    console.error("failed to get discussion", e);
  }
};

export const addComment = async ({
  threadId,
  parentId,
  text,
}: {
  threadId: string;
  parentId?: string;
  text: string;
}) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/add-comment`, {
      threadId,
      parentId,
      text,
    });
  } catch (e) {
    console.error("failed to add comment", e);
  }
};

export const upvoteComment = async (commentId: string) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/upvote-comment`, {
      commentId,
    });
  } catch (e) {
    console.error("failed to upvote comment", e);
  }
};

export const reset = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/reset`);
  } catch (e) {
    console.error("failed to reset db", e);
  }
};
