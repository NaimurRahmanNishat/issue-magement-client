// src/redux/api/baseApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getBaseUrl } from "@/utils/getBaseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Step 1: Base Query Configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1`,
  credentials: "include", 
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Step 2: Auto Refresh Logic with Proper Error Handling
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const isRefresh =
      typeof args === "object" &&
      args.url?.includes("/auth/refresh-token");

    if (!isRefresh && !(args as any)._retry) {
      (args as any)._retry = true;

      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch({ type: "auth/logout" });
      }
    } else {
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

// Step 3: Create RTK Query API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Comments", "Emergency", "Review", "Issue", "Stats"],
  endpoints: () => ({}),
});


