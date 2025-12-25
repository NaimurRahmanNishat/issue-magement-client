// src/redux/features/comments/commentApi.ts
import type { CreateCommentPayload, CreateCommentResponse, IDeleteCommentRequest, IDeleteCommentResponse, IEditCommentRequest, IEditCommentResponse, IGetAllCommentsForAdminResponse, IGetCommentsByIssueResponse, IReplyToCommentRequest, IReplyToCommentResponse } from "@/types/commentType";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/v1/reviews`,
    credentials: "include",
  }),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    // 1. Create a comment
    createComment: builder.mutation<CreateCommentResponse, CreateCommentPayload>({
      query: ({ issueId, data }) => ({
        url: `/create-comment/${issueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Comments", id: arg.issueId }],
    }), 

    // 2. Reply to a comment
    replyToComment: builder.mutation<IReplyToCommentResponse, IReplyToCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reply/${reviewId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 3. edit a comment
    editComment: builder.mutation<IEditCommentResponse, IEditCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/edit-review/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 4. delete a comment
    deleteComment: builder.mutation<IDeleteCommentResponse, IDeleteCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/${reviewId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 5. get all comments for admin
    getAllCommentsForAdmin: builder.query<IGetAllCommentsForAdminResponse, void>({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    // 6. get comments by issue id (public)
    getCommentsByIssue: builder.query<IGetCommentsByIssueResponse, { issueId: string; page?: number; limit?: number }>({
      query: ({ issueId, page = 1, limit = 10 }) => ({
        url: `/issue/${issueId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [{ type: "Comments", id: arg.issueId }],
    })
  }),
});

export const {
  useCreateCommentMutation,
  useReplyToCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useGetAllCommentsForAdminQuery,
  useGetCommentsByIssueQuery
} = commentApi;