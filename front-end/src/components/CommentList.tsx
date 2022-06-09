import Comment from "./Comment";

function CommentList({ comments }: { comments: any[] }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export default CommentList;
