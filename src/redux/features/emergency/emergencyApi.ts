/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/emergency/emergencyApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { ReceiveMessageResponse, SendMessagePayload, SendMessageResponse } from "@/types/message";


export const emergencyApi = createApi({
  reducerPath: "emergencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/v1/emergency`,
    credentials: "include",
  }),
  tagTypes: ["Emergency"],
  endpoints: (builder) => ({
    // Send emergency message
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (newMessage) => ({
        url: "/send",
        method: "POST",
        body: newMessage,
      }),
      invalidatesTags: ["Emergency"],
    }),

    // Get emergency messages with pagination
    receiveMessage: builder.query<ReceiveMessageResponse, any>({
      query: (params = {}) => {
        const { page = 1, limit = 20, unreadOnly = false } = params;
        // Fix: Build params object properly
        const queryParams: any = { page, limit };
        if (unreadOnly) {
          queryParams.unreadOnly = "true";
        }
        return {
          url: "/admin/messages",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Emergency"],
    }),

    // Mark single message as read
    markMessageAsRead: builder.mutation<any, string>({
      query: (messageId) => ({
        url: `/read/${messageId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Emergency"],
    }),

    // Mark all messages as read
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Emergency"],
    }),

    // Get unread count
    getUnreadCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => ({
        url: "/unread-count",
        method: "GET",
      }),
      providesTags: ["Emergency"],
    }),

    // Delete an emergency message
    deleteMessage: builder.mutation<{ success: boolean, message: string }, string>({
      query: (messageId) => ({
        url: `/delete/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Emergency"],
    }),

  }),
});

export const { 
  useSendMessageMutation, 
  useReceiveMessageQuery,
  useMarkMessageAsReadMutation,
  useMarkAllAsReadMutation,
  useGetUnreadCountQuery,
  useDeleteMessageMutation,
} = emergencyApi;