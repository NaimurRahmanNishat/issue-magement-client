// src/types/commentType.ts

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
}

export interface IReply {
  _id: string;
  author: IAuthor;
  comment: string;
  replies?: IReply[];
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  issue: string;
  author: IAuthor;
  comment: string;
  replies: IReply[];
  createdAt: string;
  updatedAt: string;
}

// 1. create a comment
export interface CreateCommentResponse {
  success: boolean;
  message: string;
  review: IComment;
}

export interface CreateCommentPayload {
  issueId: string;
  data: {
    comment: string;
  };
}

// 2. reply to a comment
export interface IReplyToCommentResponse {
  success: boolean;
  message: string;
  review: IComment;
}

export interface IReplyToCommentRequest {
  reviewId: string;
  data: {
    comment: string;
    parentReplyId?: string;
  };
}

// 3. edit a comment
export interface IEditCommentResponse {
  success: boolean;
  message: string;
  review: IComment;
}

export interface IEditCommentRequest {
  reviewId: string;
  data: {
    comment: string;
    replyId?: string;
  };
}

// 4. delete a comment
export interface IDeleteCommentResponse {
  success: boolean;
  message: string;
}

export interface IDeleteCommentRequest {
  reviewId: string;
  data?: {
    replyId?: string;
  };
}

// 5. get comments by issue for admin
export interface IGetAllCommentsForAdminResponse {
  success: boolean;
  source: string;
  count: number;
  reviews: IComment[];
}

// 6. get comments by issue id (public)
export interface IGetCommentsByIssueResponse {
  success: boolean;
  source: string;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  reviews: IComment[];
}
