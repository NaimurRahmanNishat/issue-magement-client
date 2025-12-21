// src/redux/features/issues/issueApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { CreateIssueResponse, DeleteIssueResponse, GetAllIssuesArgs, GetAllIssuesResponse, UpdateIssueResponse } from "@/types/issueType";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/v1/issues`,
    credentials: "include", 
  }),
  tagTypes: ["Review", "Issue"],
  endpoints: (builder) => ({
    // 1. create issue
    createIssue: builder.mutation<CreateIssueResponse, FormData>({
      query: (formData) => ({
        url: "/create-issue",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Issue"],
    }),

    // 2. get all issues
    getAllIssues: builder.query<GetAllIssuesResponse, GetAllIssuesArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          if (args.page) params.append("page", String(args.page));
          if (args.limit) params.append("limit", String(args.limit));
          if (args.sort) params.append("sort", args.sort);
          if (args.status) params.append("status", args.status);
          if (args.division) params.append("division", args.division);
          if (args.category) params.append("category", args.category);
          if (args.search) params.append("search", args.search);
        }
        const qs = params.toString();
        return {
          url: `/all-issues${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Issue"],
    }),

    // 3. issue details
    getIssueById: builder.query({
      query: (issueId) => ({
        url: `/${issueId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Issue", id }],
    }),

    // 4. update issue status
    updateIssueStatus: builder.mutation<UpdateIssueResponse, { issueId: string; status: string }>({
      query: ({ issueId, status }) => ({
        url: `/update-status/${issueId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Issue"],
    }),

    // 5. delete issue
    deleteIssue: builder.mutation<DeleteIssueResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const { useCreateIssueMutation, useGetAllIssuesQuery, useGetIssueByIdQuery, useUpdateIssueStatusMutation, useDeleteIssueMutation } = issueApi;
