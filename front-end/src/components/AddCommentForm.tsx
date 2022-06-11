import { useState, useEffect, useRef, SyntheticEvent } from "react";
import classNames from "classnames";
import { UserType } from "../types";
import { addComment } from "../api";

function AddCommentForm({
  user,
  pId,
  isReply,
}: {
  user?: UserType;
  pId?: string;
  isReply?: boolean;
}) {
  const [threadId] = useState<string>("1");
  const [parentId] = useState<string | undefined>(pId);
  const [commentText, setCommentText] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);

  const onAddComment = async (event: SyntheticEvent) => {
    event.preventDefault();
    await addComment({ threadId, parentId, text: commentText });
  };

  const textInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isReply && textInput.current) {
      textInput.current.focus();
    }
  }, [isReply]);

  return (
    <form
      method="POST"
      className={classNames({
        "add-comment": true,
        "add-comment--isReply": isReply,
      })}
      onSubmit={onAddComment}
      autoComplete="off"
    >
      <div
        className={classNames({
          "avatar-container": true,
          "avatar-container--active": isActive,
        })}
      >
        {user ? (
          <img
            className="avatar-img"
            src={`${user?.avatar}`}
            alt="userAvatar"
          />
        ) : (
          <div className="avatar-skeleton" />
        )}
      </div>
      {user ? (
        <input
          ref={textInput}
          id="comment-text"
          className="text-input"
          type="text"
          name="comment"
          placeholder="What are your thoughts?"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          required
        />
      ) : (
        <div className="text-input-skeleton"></div>
      )}
      <button className="btn btn--purple" type="submit" name="submit">
        {isReply ? "Reply" : "Comment"}
      </button>
    </form>
  );
}

export default AddCommentForm;
