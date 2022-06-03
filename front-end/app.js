const BASE_URL = "http://localhost:3000";

const getUser = async () => {
  try {
    const { data: user } = await axios.get(`${BASE_URL}/user`);
    const avatar = document.querySelector("#currentUser img");
    avatar.src = user.avatar;
    return user;
  } catch (e) {
    console.error("Failed to get user", e);
  }
};

const buildComment = (comment) => {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const hasUpvotes = comment.upvotes && comment.upvotes.length > 0;
  return `
    <div
        class="comment ${hasReplies ? "comment--has-replies" : ""}"
        id="${comment.id}"
    >
        <div class="avatar-container">
            <img
                src="${comment.user.avatar}"
                alt="${comment.user.name}-avatar"
            />
            ${
              hasReplies
                ? `<div class="avatar-container__reply-line"></div>`
                : ""
            }
        </div>

        <div class="comment__body">
            <div class="comment__header">
                <div class="comment__username">${comment.user.name}</div>
                    <span class="comment__divider">•</span>
                    <div class="comment__time">${comment.time}</div>
                </div>
                <p class="comment__text">${comment.text}</p>
                <div class="comment__actions-container">
                    <div class="comment__actions">
                        <div id="upvote-${comment.id}" class="comment__upvote">
                            <div class="comment__upvote-icon">&#9650;</div>
                                Upvote ${
                                  hasUpvotes
                                    ? `(${comment.upvotes.length})`
                                    : ""
                                }
                            </div>
                        <div
                            id="reply-${comment.id}"
                            class="comment__reply"
                        >
                            Reply
                        </div>
                    </div>
                </div>

                ${
                  hasReplies
                    ? `${comment.replies
                        .map((reply) => buildComment(reply))
                        .join("")}`
                    : ""
                }
            </div>
        </div>
  
`;
};

const getDiscussion = async () => {
  const commentList = document.getElementById("comment-list");
  commentList.innerHTML = "";

  try {
    const response = await axios.get(BASE_URL);
    const { data: comments } = response;
    comments.forEach((comment) =>
      commentList.insertAdjacentHTML("beforeend", buildComment(comment))
    );
  } catch (e) {
    console.error("Failed to get discussion", e);
  }
};

const addComment = async (
  { threadId, parentId, text } = { parentId: null }
) => {
  try {
    await axios.post(`${BASE_URL}/add-comment`, {
      threadId,
      parentId,
      text,
    });
    await getDiscussion();
  } catch (e) {
    console.error(e);
  }
};

const upvoteComment = async ({ userId, commentId }) => {
  try {
    await axios.post(`${BASE_URL}/upvote-comment`, {
      userId,
      commentId,
    });
    await getDiscussion();
  } catch (e) {
    console.error(e);
  }
};

const setupAddCommentForm = () => {
  const form = document.getElementById("add-comment-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const threadId = 1; // demo default
    const commentInput = document.getElementById("comment-text");
    const text = commentInput.value;
    await addComment({ threadId, text });
    commentInput.value = "";
  });
};

const setupUpvoteListeners = () =>
  document.addEventListener(
    "click",
    async (event) => {
      if (!event.target.matches(".comment__upvote")) return;
      event.preventDefault();
      const userId = "rob";
      const commentId = event.target.id.split("-")[1];
      console.log("commentId", commentId);
      await upvoteComment({ userId, commentId });
    },
    false
  );

const setupReplyListeners = () =>
  document.addEventListener(
    "click",
    async (event) => {
      if (!event.target.matches(".comment__reply")) return;
      event.preventDefault();
      const isReplying = document.querySelector(".add-reply");

      if (isReplying) {
        isReplying.remove();
        return;
      }

      const commentId = event.target.id.split("-")[1];
      const replyForm = `
        <form
            id="add-reply-form"
            action="${BASE_URL}/add-comment"
            method="POST"
            class="add-reply"
        >
            <input
                id="${commentId}-comment-text"
                class="text-input"
                type="text"
                name="reply"
                placeholder=""
                required
            />
            <button class="btn btn--purple" type="submit" name="submit">
                Reply
            </button>
        </form>
    `;

      const el = document.getElementById(`${commentId}`);
      el.querySelector(
        ".comment__body .comment__actions-container"
      ).insertAdjacentHTML("beforeend", replyForm);

      const form = document.getElementById("add-reply-form");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const threadId = 1;
        const commentInput = document.getElementById(
          `${commentId}-comment-text`
        );
        const text = commentInput.value;
        await addComment({ threadId, parentId: commentId, text });
        commentInput.value = "";
      });
    },
    false
  );

// Start App
getUser();
getDiscussion();
setupAddCommentForm();
setupUpvoteListeners();
setupReplyListeners();
