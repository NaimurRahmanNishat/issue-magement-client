// src/redux/features/auth/authApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { ActivateUserPayload, ActivateUserResponse, DeleteCategoryAdminRoleResponse, EditProfileByIdPayload, EditProfileByIdResponse, ForgotPasswordPayload, ForgotPasswordResponse, GetAllCategoryAdminsResponse, GetAllUsersResponse, GetProfileByIdResponse, LoginResponse, LogoutResponse, PaginationParams, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UpdateCategoryAdminRolePayload, UpdateCategoryAdminRoleResponse, UserLoginPayload, UserRegisterPayload } from "@/types/authType";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Register user (Super admin creates category-admin, or regular user registration)
    register: builder.mutation<RegisterResponse, UserRegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // 2. Activate user account
    activateUser: builder.mutation<ActivateUserResponse, ActivateUserPayload>({
      query: (data) => ({
        url: "/auth/activate-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            // Update Redux state
            dispatch({ type: "auth/setUser", payload: data.data });
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("❌ Activation failed:", error);
        }
      },
    }),

    // 3. Login user
    login: builder.mutation<LoginResponse, UserLoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            dispatch({ type: "auth/setUser", payload: data.data });
            localStorage.setItem("user", JSON.stringify(data.data));
            console.log("✅ Login successful");
          }
        } catch (error) {
          console.error("❌ Login failed:", error);
        }
      },
    }),

    // 4. Logout user
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch({ type: "auth/logout" });
          localStorage.removeItem("user");
        } catch (error) {
          console.error("❌ Logout failed:", error);
        }
      },
    }),

    // 5. forgot password (Send OTP)
    forgetPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // 6. reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // 7. edit profile by id
    editProfileById: builder.mutation<EditProfileByIdResponse, EditProfileByIdPayload>({
      query: ({ formData }) => ({
        url: `/auth/edit-profile`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            dispatch({ type: "auth/setUser", payload: data.data });
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("❌ Profile update failed:", error);
        }
      },
    }),

    // 8. get profile by id
    getProfileById: builder.query<GetProfileByIdResponse, void>({
      query: () => ({
        url: `/auth/me`, 
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            dispatch({ type: "auth/setUser", payload: data.data });
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("❌ Failed to fetch profile:", error);
        }
      },
    }),

    // 9. get all normal users
    getAllUsers: builder.query<GetAllUsersResponse, PaginationParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.cursor) queryParams.append("cursor", params.cursor);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: `/auth/all-users${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) => 
        result?.data ? [
            ...result.data.map(({ _id }) => ({ type: "User" as const, id: _id })),
            { type: "User", id: "LIST" },
          ]
        : [{ type: "User", id: "LIST" }],
    }),

    // 10. get all category admins
    getAllCategoryAdmins: builder.query<GetAllCategoryAdminsResponse, PaginationParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.cursor) queryParams.append("cursor", params.cursor);
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: `/auth/all-category-admins${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) => 
        result?.data 
          ? [
              ...result.data.map(({ _id }) => ({ type: "User" as const, id: _id })),
              { type: "User", id: "ADMIN_LIST" },
            ]
          : [{ type: "User", id: "ADMIN_LIST" }],
    }),

    // 11. update category admin role
    updateCategoryAdminRole: builder.mutation<UpdateCategoryAdminRoleResponse,UpdateCategoryAdminRolePayload>({
      query: ({ id, ...data }) => ({
        url: `/auth/update-category-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "ADMIN_LIST" },
      ],
    }),

    // 12. delete category admin 
    deleteCategoryAdminById: builder.mutation<DeleteCategoryAdminRoleResponse, string>({
      query: (id) => ({
        url: `/auth/delete-category-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "User", id },{ type: "User", id: "ADMIN_LIST" }],
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useActivateUserMutation, 
  useLoginMutation, 
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
