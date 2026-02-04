/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IDistrict, IOtpResponse } from "@/types";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // District endpoints
    createDistrict: builder.mutation<
      IOtpResponse<IDistrict>,
      Partial<IDistrict>
    >({
      query: (data: any) => ({
        url: "/district/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["DISTRICT"],
    }),

    getDistricts: builder.query<IOtpResponse<IDistrict[]>, void>({
      query: () => ({
        url: "/district",
        method: "GET",
      }),
      providesTags: ["DISTRICT"],
    }),
  }),
});

export const { useCreateDistrictMutation, useGetDistrictsQuery } =
  districtApi;

