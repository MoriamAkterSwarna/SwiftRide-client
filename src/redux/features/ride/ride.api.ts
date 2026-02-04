/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type {
  IRideType,
  IRide,
  IOtpResponse,
} from "@/types";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Ride Type endpoints
    createRideType: builder.mutation<
      IOtpResponse<IRideType>,
      Partial<IRideType>
    >({
      query: (data: any) => ({
        url: "/ride/ride-type/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["RIDE_TYPE"],
    }),
    getRideTypes: builder.query<IOtpResponse<IRideType[]>, void>({
      query: () => ({
        url: "/ride/ride-type",
        method: "GET",
      }),
      providesTags: ["RIDE_TYPE"],
    }),

    deleteRideType: builder.mutation<IOtpResponse<IRideType>, string>({
      query: (id: string) => ({
        url: `/ride/ride-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RIDE_TYPE"],
    }),

    // Ride endpoints
    createRide: builder.mutation<IOtpResponse<IRide>, Partial<IRide>>({
      query: (data: any) => ({
        url: "/ride",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["RIDE"],
    }),
    getRides: builder.query<IOtpResponse<IRide[]>, Record<string, any>>({
      query: (params: any) => ({
        url: "/ride",
        method: "GET",
        params: params,
      }),
      providesTags: ["RIDE"],
    }),
     getEarningsData: builder.query({
      query: ({ period }) => ({
        url: "/ride/earnings",
        method: "GET",
        params: { period },
      }),
      providesTags: ["RIDE"],
    }),

    getRideHistory: builder.query({
      query: (params: any) => ({
        url: "/ride/history",
        method: "GET",
        params: params,
      }),
      providesTags: ["RIDE"],
    }),

    getRideAnalytics: builder.query({
      query: () => ({
        url: "/stats/dashboard",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useCreateRideTypeMutation,
  useGetRideTypesQuery,
  useDeleteRideTypeMutation,
  useCreateRideMutation,
  useGetRidesQuery,
  useGetEarningsDataQuery,
  useGetRideHistoryQuery,
  useGetRideAnalyticsQuery,
} = rideApi;
