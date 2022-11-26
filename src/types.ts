export interface Post {
  text: string
  id: string
  userId: string
  user: User
  topic: Topic
  comments: Comment[] | []
  username: string
}

export interface Topic {
  id: string
  title: string
}

export interface Comment {
  createdAt: string
  id: string
  postId: string
  text: string
  updatedAt: string
  userId: string
}

export interface User {
  email: string
  id: string
  name: string
  password: string
  profile_pic: string
  username: string
}
