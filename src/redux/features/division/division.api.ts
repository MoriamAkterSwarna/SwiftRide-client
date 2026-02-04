/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IOtpResponse, IDivision } from "@/types";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDivision: builder.mutation<IOtpResponse<IDivision>, FormData>({
      query: (data: any) => ({
        url: "/division/create-division",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["DIVISION"],
    }),
    getDivisions: builder.query<IOtpResponse<IDivision[]>, void>({
      query: () => ({
        url: "/division",
        method: "GET",
      }),
      providesTags: ["DIVISION"],
    }),
  }),
});

export const { useCreateDivisionMutation, useGetDivisionsQuery } = divisionApi;
