import Comment from "./Comment";

const getRandomNumber = () => ((Math.random() * 3) | 0) + 1;
function CommentList({ comments }: { comments: any[] }) {
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
          {Array.from({ length: getRandomNumber() }).map((i) => (
            <div className="comment comment--skeleton">
              <div className="avatar-container">
                <div className="avatar-skeleton" />
              </div>
              <div className="comment__body">
                <div className="comment__header comment__header--skeleton" />
                {Array.from({ length: getRandomNumber() }).map((i) => (
                  <div className="comment__text comment__text--skeleton" />
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
