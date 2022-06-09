import { useState, useEffect } from "react";
import AddCommentForm from "./components/AddCommentForm";
import CommentList from "./components/CommentList";
import Admin from "./components/Admin";
import { getUser, getComments } from "./api";
import { User } from "./types";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | undefined>();
  const [comments, setComments] = useState([]);

  const onGetUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  const onGetComments = async () => {
    const comments = await getComments();
    setComments(comments);
  };

  useEffect(() => {
    setTimeout(() => {
      onGetUser();
      onGetComments();
    }, 500);
  }, []);

  return (
    <div className="container">
      <h1 className="header">Discussion</h1>
      {user ? <AddCommentForm user={user} /> : <div>Loading...</div>}
      <hr className="divider" />
      {comments ? <CommentList comments={comments} /> : <div>Loading...</div>}
      <Admin />
    </div>
  );
}

export default App;
