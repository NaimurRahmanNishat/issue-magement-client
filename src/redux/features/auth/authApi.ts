
// src/redux/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ActivateUserPayload, ActivateUserResponse, DeleteCategoryAdminRoleResponse, EditProfileByIdResponse, ForgotPasswordPayload, ForgotPasswordResponse, GetAllCategoryAdminsResponse, GetAllUsersResponse, GetProfileByIdResponse, LoginResponse, LogoutResponse, RefreshTokenResponse, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UpdateCategoryAdminRolePayload, UpdateCategoryAdminRoleResponse, UserLoginPayload, UserRegisterPayload } from "@/types/authType";
import { getBaseUrl } from "@/utils/getBaseUrl";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/v1/auth`,
    credentials: "include", // Cookie send
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // 1. Register user
    register: builder.mutation<RegisterResponse, UserRegisterPayload>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 2. Activate user account
    activateUser: builder.mutation<ActivateUserResponse, ActivateUserPayload>({
      query: (data) => ({
        url: "/activate-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 3. Login user
    login: builder.mutation<LoginResponse, UserLoginPayload>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            // Redux store update after user save
            dispatch({ type: "auth/setUser", payload: data.data });
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    // 4. Refresh access token
    refreshToken: builder.mutation<RefreshTokenResponse, { userId: string }>({
      query: (data) => ({
        url: "/refresh-token",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            // Redux store update
            dispatch({ type: "auth/setUser", payload: data.data });
          }
        } catch (err) {
          // Refresh fail then logout
          console.error("Token refresh failed:", err);
          dispatch({ type: "auth/logout" });
        }
      },
    }),

    // 5. Logout user
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth", "User"], 
    }),

    //6. forgot password
    forgetPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    //7. reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // 8. edit profile by id - FIXED WITH PROPER STATE MANAGEMENT
    editProfileById: builder.mutation<EditProfileByIdResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/edit-profile/${id}`, 
        method: "PUT",
        body: formData ,
      }),
      invalidatesTags: ["User"],
      // Update both Redux state and localStorage immediately
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            // Update Redux state
            dispatch({ type: "auth/setUser", payload: data.data });
            
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("Profile update failed:", error);
        }
      },
    }),

    // 9. get profile by id
    getProfileById: builder.query<GetProfileByIdResponse, string>({
      query: (id) => ({
        url: `/me/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 10. get all normal users
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: `/all-users`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 11. get all category admins
    getAllCategoryAdmins: builder.query<GetAllCategoryAdminsResponse, void>({
      query: () => ({
        url: `/all-category-admins`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 12. update category admin role
    updateCategoryAdminRole: builder.mutation<UpdateCategoryAdminRoleResponse, UpdateCategoryAdminRolePayload>({
      query: ({ id, ...data }) => ({
        url: `/update-category-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 13. delete category admin 
    deleteCategoryAdminById: builder.mutation<DeleteCategoryAdminRoleResponse, string>({
      query: (id) => ({
        url: `/delete-category-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useActivateUserMutation, 
  useLoginMutation, 
  useRefreshTokenMutation, 
  useLogoutMutation, 
  useForgetPasswordMutation, 
  useResetPasswordMutation, 
  useEditProfileByIdMutation, 
  useGetProfileByIdQuery, 
  useGetAllUsersQuery, 
  useGetAllCategoryAdminsQuery, 
  useUpdateCategoryAdminRoleMutation, 
  useDeleteCategoryAdminByIdMutation 
} = authApi;