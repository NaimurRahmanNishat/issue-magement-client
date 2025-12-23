// src/redux/features/auth/authApi.ts
import type { ActivateUserPayload, ActivateUserResponse, DeleteCategoryAdminRoleResponse, EditProfileByIdResponse, ForgotPasswordPayload, ForgotPasswordResponse, GetAllCategoryAdminsResponse, GetAllUsersResponse, GetProfileByIdResponse, LoginResponse, LogoutResponse, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UpdateCategoryAdminRolePayload, UpdateCategoryAdminRoleResponse, UserLoginPayload, UserRegisterPayload } from "@/types/authType";
import { baseApi } from "@/redux/api/baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Register user
    register: builder.mutation<RegisterResponse, UserRegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 2. Activate user account
    activateUser: builder.mutation<ActivateUserResponse, ActivateUserPayload>({
      query: (data) => ({
        url: "/auth/activate-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 3. Login user
    login: builder.mutation<LoginResponse, UserLoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // 4. Logout user
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth", "User"], 
    }),

    // 5. forgot password
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
    editProfileById: builder.mutation<EditProfileByIdResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/auth/edit-profile/${id}`, 
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

    // 8. get profile by id
    getProfileById: builder.query<GetProfileByIdResponse, string>({
      query: (id) => ({
        url: `/auth/me/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 9. get all normal users
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: `/auth/all-users`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 10. get all category admins
    getAllCategoryAdmins: builder.query<GetAllCategoryAdminsResponse, void>({
      query: () => ({
        url: `/auth/all-category-admins`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // 11. update category admin role
    updateCategoryAdminRole: builder.mutation<UpdateCategoryAdminRoleResponse, UpdateCategoryAdminRolePayload>({
      query: ({ id, ...data }) => ({
        url: `/auth/update-category-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 12. delete category admin 
    deleteCategoryAdminById: builder.mutation<DeleteCategoryAdminRoleResponse, string>({
      query: (id) => ({
        url: `/auth/delete-category-admin/${id}`,
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
