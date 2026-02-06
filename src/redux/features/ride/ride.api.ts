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
    createRide: builder.mutation<IOtpResponse<IRide>, any>({
      query: (data: any) => ({
        url: "/ride/create",
        method: "POST",
        data: data,
        // Let axios automatically set Content-Type for FormData with boundary
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ["RIDE"],
    }),

    getRides: builder.query<IOtpResponse<IRide[]>, Record<string, any>>({
      query: (params: any) => ({
        url: "/ride-request/request",
        method: "GET",
        params: params,
      }),
      providesTags: ["RIDE"],
    }),

    getRideById: builder.query<IOtpResponse<IRide>, string>({
      query: (id: string) => ({
        url: `/ride/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    updateRide: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/ride/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["RIDE"],
    }),

    acceptRideRequest: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/ride-request/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["RIDE"],
    }),

    rejectRideRequest: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/ride-request/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),

    cancelRide: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/ride/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),

    estimateFare: builder.mutation({
      query: (data: any) => ({
        url: "/fare/estimate",
        method: "POST",
        data: data,
      }),
    }),

    requestRide: builder.mutation({
      query: (data: any) => ({
        url: "/ride/create",
        method: "POST",
        data: data,
      }),
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
        url: "/ride-request/my-history",
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

    getRideRequests: builder.query({
      query: (params?: any) => ({
        url: "/driver/all-rides-pending",
        method: "GET",
        params: params,
      }),
      providesTags: ["RIDE"],
    }),

    getOngoingRides: builder.query({
      query: () => ({
        url: "/ride/ongoing",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    getUserRide: builder.query({
      query: (params: any) => ({
        url: "/ride/my-rides",
        method: "GET",
        params: params,
      }),
      providesTags: ["RIDE"],
      transformResponse: (response: any) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    // get rides data for Driver
    // /available-rides 
    
    getAvailableRides: builder.query({
      query: () => ({
        url: "/ride-request/available-rides",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    getUserActiveRideRequests: builder.query({
      query: () => ({
        url: "/ride-request/user/active",
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
  useGetRideByIdQuery,
  useUpdateRideMutation,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
  useCancelRideMutation,
  useEstimateFareMutation,
  useRequestRideMutation,
  useGetEarningsDataQuery,
  useGetRideHistoryQuery,
  useGetRideAnalyticsQuery,
  useGetRideRequestsQuery,
  useGetOngoingRidesQuery,
  useGetUserRideQuery,
  useGetAvailableRidesQuery,
  useGetUserActiveRideRequestsQuery,
} = rideApi;
