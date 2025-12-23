/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/emergency/emergencyApi.ts
import { baseApi } from "@/redux/api/baseApi";
import type { ReceiveMessageResponse, SendMessagePayload, SendMessageResponse } from "@/types/message";


export const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Send emergency message
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (newMessage) => ({
        url: "/emergency/send",
        method: "POST",
        body: newMessage,
      }),
      invalidatesTags: ["Emergency"],
    }),

    // 2. Get emergency messages with pagination
    receiveMessage: builder.query<ReceiveMessageResponse, any>({
      query: (params = {}) => {
        const { page = 1, limit = 20, unreadOnly = false } = params;
        // Fix: Build params object properly
        const queryParams: any = { page, limit };
        if (unreadOnly) {
          queryParams.unreadOnly = "true";
        }
        return {
          url: "/emergency/admin/messages",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Emergency"],
    }),

    // 3. Mark single message as read
    markMessageAsRead: builder.mutation<any, string>({
      query: (messageId) => ({
        url: `/emergency/read/${messageId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Emergency"],
    }),

    // 4. Mark all messages as read
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/emergency/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Emergency"],
    }),

    // 5. Get unread count
    getUnreadCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => ({
        url: "/emergency/unread-count",
        method: "GET",
      }),
      providesTags: ["Emergency"],
    }),

    // 6. Delete an emergency message
    deleteMessage: builder.mutation<{ success: boolean, message: string }, string>({
      query: (messageId) => ({
        url: `/emergency/delete/${messageId}`,
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
