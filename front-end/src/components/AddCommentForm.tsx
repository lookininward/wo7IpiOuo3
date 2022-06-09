import classNames from "classnames";
import React from "react";
import { User } from "../types";
import { addComment } from "../api";

function AddCommentForm({
  user,
  pId,
  isReply,
}: {
  user?: User;
  pId?: string;
  isReply?: boolean;
}) {
  const [threadId] = React.useState<string>("1");
  const [parentId] = React.useState<string | undefined>(pId);
  const [comment, setComment] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  const onAddComment = async (event: any) => {
    event.preventDefault();
    await addComment({ threadId, parentId, text: comment });
  };

  const textInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isReply && textInput.current) {
      textInput.current.focus();
    }
  }, [isReply]);

  return (
    <form
      id="add-comment-form"
      action="http://localhost:3000/add-comment"
      method="POST"
      className={classNames({
        "add-comment": true,
        "add-comment--isReply": isReply,
      })}
      onSubmit={onAddComment}
      autoComplete="off"
    >
      <div
        id="currentUser"
        className={classNames({
          "avatar-container": true,
          "avatar-container--active": isActive,
        })}
      >
        <img src={`${user?.avatar}`} alt="userAvatar" />
      </div>
      <input
        ref={textInput}
        id="comment-text"
        className="text-input"
        type="text"
        name="comment"
        placeholder="What are your thoughts?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onFocus={() => setIsActive(true)}
        onBlur={(e) => setIsActive(false)}
        required
      />
      <button className="btn btn--purple" type="submit" name="submit">
        Comment
      </button>
    </form>
  );
}

export default AddCommentForm;
