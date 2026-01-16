
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://swift-ride-backend-red.vercel.app/api/v1",
    
  }),
  endpoints: () => ({}),
});