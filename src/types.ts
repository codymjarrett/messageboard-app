export interface Post {
  text: string
  id: string
  userId: string
  user: User
  topic: Topic
  comments: Comment[] | []
  likes: Like[] | []
  username: string
  createdAt: string
}

export interface Topic {
  id: string
  title: string
}

export interface User {
  email: string
  id: string
  name: string
  profile_pic: string
  sub: string
  username: string
}

export interface Comment {
  createdAt: string
  id: string
  postId: string
  text: string
  updatedAt: string
  userId: string
  user: User
}

export interface Like {
  userId: string
  postId?: string
  commentId?: string
}

export interface User {
  email: string
  id: string
  name: string
  password: string
  profile_pic: string
  username: string
}
