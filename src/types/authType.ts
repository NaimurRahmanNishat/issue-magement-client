// src/types/authType.ts

export type Role = "user" | "category-admin" | "super-admin";
export type CategoryType = "broken_road" | "water" | "gas" | "electricity" | "other";
export type Division = "Dhaka" | "Chattogram" | "Rajshahi" | "Khulna" | "Barishal" | "Sylhet" | "Rangpur" | "Mymensingh";
export type ImageType = { public_id: string; url: string };

export interface TAuthUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  nid?: string;
  isVerified: boolean;
  role: Role;
  category?: CategoryType;
  division?: Division;
  avatar?: ImageType;
  nidPic?: ImageType[];
  refreshToken?: string | null;
  refreshTokenExpiry?: Date | null;
  activationCode?: string | null;
  activationCodeExpiry?: Date | null;
  lastActivationCodeSentAt?: Date | null;
  resetPasswordOtp?: string | null;
  resetPasswordOtpExpiry?: Date | null;
  profession?: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}


// ================================= API Response Types & Payload ==================================

// 1. register api
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    expiresIn: string;
  };
}

export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  nid: string;
  category?: CategoryType;
}


// 2. activate api
export interface ActivateUserResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}

export interface ActivateUserPayload {
  email: string;
  activationCode: string;
}


// 3. login api
export interface LoginResponse {
  success: boolean;
  message: string;
  data: TAuthUser;  
}

export interface UserLoginPayload {
  email: string;
  password: string;
}


// 4. refresh token
export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: TAuthUser;
}


// 5. logout
export interface LogoutResponse {
  success: boolean;
  message: string;
}


// 6. forgot password
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}


// 7. reset password
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
}


// 8. edit profile by id
export interface EditProfileByIdResponse {
  success: boolean;
  message: string;
  data: TAuthUser;
}

export interface EditProfileByIdPayload {
  id: string;
  name?: string;
  email?: string;
  zipCode?: string;
  profession?: string;
  phone?: string;
  avatar?: ImageType;
  nidPic?: ImageType[]; 
  division?: Division;
}


// 9. get profile by id
export interface GetProfileByIdResponse {
  success: boolean;
  message: string;
  data: TAuthUser;
}


// 10. get all normal users
export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: TAuthUser[];
  totalUsers: number;
}


// 11. get all category admins
export interface GetAllCategoryAdminsResponse {
  success: boolean;
  message: string;
  totalCategoryAdmins: number;
  data: TAuthUser[];
}


// 12. update category admin role
export interface UpdateCategoryAdminRoleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    category: CategoryType;
    division: Division;
  };
}

export interface UpdateCategoryAdminRolePayload {
  id: string;
  category: CategoryType;
  division: Division;
}


// 13. delete category admin
export interface DeleteCategoryAdminRoleResponse {
  success: boolean;
  message: string;
}
