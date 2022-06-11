import { useState, useEffect } from "react";
import AddCommentForm from "./components/AddCommentForm";
import CommentList from "./components/CommentList";
import Admin from "./components/Admin";
import { getUser, getComments } from "./api";
import { UserType, CommentType } from "./types";
import { UserContext } from "./contexts";
import "./App.css";

function App() {
  const [user, setUser] = useState<UserType>();
  const [comments, setComments] = useState<CommentType[]>([]);

  const onGetUser = async () => {
    const user: UserType = await getUser();
    setUser(user);
  };

  const onGetComments = async () => {
    const comments: CommentType[] = await getComments();
    setComments(comments);
  };

  useEffect(() => {
    setTimeout(() => {
      onGetUser();
      onGetComments();
    }, 500); // simulate page load to show skeletons
  }, []);

  return (
    <div className="container">
      <UserContext.Provider value={user}>
        <h1 className="header">Discussion</h1>
        <AddCommentForm />
        <hr className="divider" />
        <CommentList comments={comments} />
        <Admin />
      </UserContext.Provider>
    </div>
  );
}

export default App;
