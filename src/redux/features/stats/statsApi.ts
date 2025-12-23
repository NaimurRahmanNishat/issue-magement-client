import { baseApi } from "@/redux/api/baseApi";

// Admin Stats Response

// Types
export interface MonthlyIssue {
  month: number;
  count: number;
}
export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalIssues: number;
    pendingIssues: number;
    inProgressIssues: number;
    solvedIssues: number;
    monthlyIssues: MonthlyIssue[];
  };
}

// User Stats Response
export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalIssues: number;
    totalReviewAndComment: number;
    totalSolved: number;
    totalPending: number;
    totalInProgress: number;
    monthlyIssues: MonthlyIssue[]; 
  };
}

// Category Admin Stats Response
export interface CategoryAdminStatsResponse {
  success: boolean;
  message: string;
  data: {
    category: string;
    totalIssues: number;
    pendingIssues: number;
    inProgressIssues: number;
    solvedIssues: number;
    monthlyPostIssue: [];
  };
}


const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get user stats by email
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => ({
        url: `/stats/user-stats`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),

    // 2. Get admin stats (no args)
    getAdminStats: builder.query<AdminStatsResponse, void>({
      query: () => ({
        url: `/stats/admin-stats`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),

    // 3. Get category admin stats (no args)
    getCategoryAdminStats: builder.query<CategoryAdminStatsResponse, void>({
      query: () => ({
        url: `/stats/category-admin-stats`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetUserStatsQuery, useGetCategoryAdminStatsQuery } = statsApi;
export default statsApi;
