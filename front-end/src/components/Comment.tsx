import { useState, useEffect } from "react";
import classNames from "classnames";
import ClickAwayListener from "react-click-away-listener";
import AddCommentForm from "./AddCommentForm";
import CommentList from "./CommentList";
import { getUser, upvoteComment } from "../api";

function Comment({ comment }: { comment: any }) {
  const [hasReplies, setHasReplies] = useState(false);
  const [hasUpvotes, setHasUpvotes] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [user, setUser] = useState(); // todo: global user state

  const replyToComment = async () => {
    setIsReplying(!isReplying);
  };

  useEffect(() => {
    getUser().then((user) => setUser(user));
    setHasReplies(comment.replies.length > 0);
    setHasUpvotes(comment.upvotes.length > 0);
  }, [comment]);
  return (
    <div
      id={comment.id}
      className={classNames({
        comment: true,
        "comment--has-replies": hasReplies,
      })}
    >
      <div className="avatar-container">
        <img src={comment.user.avatar} alt={`${comment.user.name}-avatar`} />
        {hasReplies && <div className="avatar-container__reply-line"></div>}
      </div>

      <div className="comment__body">
        <div className="comment__header">
          <div className="comment__username">{comment.user.name}</div>
          <span className="comment__divider">•</span>
          <div className="comment__time">{comment.time}</div>
        </div>
        <p className="comment__text">{comment.text}</p>
        <div className="comment__actions-container">
          <div className="comment__actions">
            <div
              id={`upvote-${comment.id}`}
              className="comment__upvote"
              onClick={() => upvoteComment(comment.id)}
            >
              <div className="comment__upvote-icon">&#9650;</div>
              Upvote {hasUpvotes && `(${comment.upvotes.length})`}
            </div>
            <div
              id={`reply-${comment.id}`}
              className="comment__reply"
              onClick={replyToComment}
            >
              Reply
            </div>
          </div>

          {isReplying && (
            <ClickAwayListener onClickAway={() => setIsReplying(false)}>
              <div className="add-reply">
                <AddCommentForm user={user} pId={comment.id} isReply />
              </div>
            </ClickAwayListener>
          )}
        </div>

        {comment.replies.length > 0 && (
          <CommentList comments={comment.replies} />
        )}
      </div>
    </div>
  );
}

export default Comment;
