export type UserType = {
  id: string;
  name: string;
  avatar: string;
};

export type CommentType = {
  id: string;
  replies: CommentType[];
  upvotes: [];
  time: string;
  text: string;
  user: UserType;
};
