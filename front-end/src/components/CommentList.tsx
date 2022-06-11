import Comment from "./Comment";
import { CommentType } from "../types";
import { getRandomNumber } from "../utils";

function CommentList({ comments }: { comments: CommentType[] }) {
  return (
    <>
      {comments.length ? (
        <div className="comment-list">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="comment-list comment-list--skeleton">
          {Array.from({ length: getRandomNumber() }).map((_, i) => (
            <div key={`${i}-comment`} className="comment comment--skeleton">
              <div className="avatar-skeleton" />
              <div className="comment__body">
                <div className="comment__header comment__header--skeleton" />
                {Array.from({ length: getRandomNumber() }).map((_, x) => (
                  <div
                    key={`${x}-comment-text`}
                    className="comment__text comment__text--skeleton"
                  />
                ))}
                <div className="comment__actions comment__actions--skeleton" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default CommentList;
