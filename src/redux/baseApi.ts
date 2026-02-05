/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import config from "@/config";
import axiosBaseQuery from "./asiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://swift-ride-backend-red.vercel.app/api/v1",

  // }),

  baseQuery: axiosBaseQuery(),

  // baseQuery: fetchBaseQuery({
  //   baseUrl: config.baseUrl,
  //   credentials: "include",

  // }),

  tagTypes: ["USER", "RIDE", "DIVISION", "DISTRICT", "RIDE_TYPE", "DRIVER"],
  endpoints: () => ({}),
});
