import { useState, useEffect } from "react";
import classNames from "classnames";
import ClickAwayListener from "react-click-away-listener";
import AddCommentForm from "./AddCommentForm";
import CommentList from "./CommentList";
import { upvoteComment } from "../api";
import { CommentType } from "../types";

function Comment({ comment }: { comment: CommentType }) {
  const [hasReplies, setHasReplies] = useState(false);
  const [hasUpvotes, setHasUpvotes] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  useEffect(() => {
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
        <img
          className="avatar-img"
          src={comment.user.avatar}
          alt={`${comment.user.name}-avatar`}
        />
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
          <div className="comment__actions prevent-select">
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
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </div>
          </div>

          {isReplying && (
            <ClickAwayListener onClickAway={() => setIsReplying(false)}>
              <div className="add-reply">
                <div className="display-block-tablet">
                  <div className="modal-header">
                    Replying to @{comment.user.name}
                    <div
                      className="modal-header__close"
                      onClick={() => setIsReplying(false)}
                    >
                      &times;
                    </div>
                  </div>
                  <div className="comment comment--isolate">
                    <div className="avatar-container">
                      <img
                        className="avatar-img"
                        src={comment.user.avatar}
                        alt={`${comment.user.name}-avatar`}
                      />
                    </div>
                    <div className="comment__body">
                      <div className="comment__header">
                        <div className="comment__username">
                          {comment.user.name}
                        </div>
                        <span className="comment__divider">•</span>
                        <div className="comment__time">{comment.time}</div>
                      </div>
                      <p className="comment__text">{comment.text}</p>
                    </div>
                  </div>
                </div>

                <AddCommentForm
                  pId={comment.id}
                  isReply
                  onReply={() => setIsReplying(false)}
                />
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
