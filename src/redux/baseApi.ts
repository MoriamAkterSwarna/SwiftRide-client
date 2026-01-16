
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./asiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://swift-ride-backend-red.vercel.app/api/v1",
    
  // }),

  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});