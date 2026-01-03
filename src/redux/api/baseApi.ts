// src/redux/api/baseApi.ts

import { getBaseUrl } from "@/utils/getBaseUrl";
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";


// Step 1: Base Query Configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1`, 
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include', 
});


// Step 2: Auto Refresh Logic with Proper Error Handling
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs,unknown,FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      await new Promise((r) => setTimeout(r, 50));
      // If the refresh is successful, retry the previous request.
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};


// Step 3: Create RTK Query API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Comments", "Review", "Issue", "Stats", "Message"],
  endpoints: () => ({}),
});
