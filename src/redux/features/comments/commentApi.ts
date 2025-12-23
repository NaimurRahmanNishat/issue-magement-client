// src/redux/features/comments/commentApi.ts
import { baseApi } from "@/redux/api/baseApi";
import type { CreateCommentPayload, CreateCommentResponse, IDeleteCommentRequest, IDeleteCommentResponse, IEditCommentRequest, IEditCommentResponse, IGetAllCommentsForAdminResponse, IGetCommentsByIssueResponse, IReplyToCommentRequest, IReplyToCommentResponse } from "@/types/commentType";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create a comment
    createComment: builder.mutation<CreateCommentResponse, CreateCommentPayload>({
      query: ({ issueId, data }) => ({
        url: `/reviews/create-comment/${issueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Comments", id: arg.issueId }],
    }), 

    // 2. Reply to a comment
    replyToComment: builder.mutation<IReplyToCommentResponse, IReplyToCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/reply/${reviewId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 3. edit a comment
    editComment: builder.mutation<IEditCommentResponse, IEditCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/edit-review/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 4. delete a comment
    deleteComment: builder.mutation<IDeleteCommentResponse, IDeleteCommentRequest>({
      query: ({ reviewId, data }) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // 5. get all comments for admin
    getAllCommentsForAdmin: builder.query<IGetAllCommentsForAdminResponse, void>({
      query: () => ({
        url: `/reviews/`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    // 6. get comments by issue id (public)
    getCommentsByIssue: builder.query<IGetCommentsByIssueResponse, { issueId: string; page?: number; limit?: number }>({
      query: ({ issueId, page = 1, limit = 10 }) => ({
        url: `/reviews/issue/${issueId}?page=${page}&limit=${limit}`,
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
