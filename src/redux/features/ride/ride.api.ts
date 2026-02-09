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

    updateRideType: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/ride/ride-type/${id}`,
        method: "PATCH",
        data: data,
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

    getRideById: builder.query<IOtpResponse<IRide>, string>({
      query: (id: string) => ({
        url: `/ride/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    getRides: builder.query<IOtpResponse<IRide[]>, Record<string, any>>({
      query: (params: any) => ({
        url: "/ride-request/request",
        method: "GET",
        params: params,
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
        url: `/ride/${id}/driver-accept`,
        method: "PATCH",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistically remove the ride from available rides
        const patchResult = dispatch(
          rideApi.util.updateQueryData('getAvailableRides', undefined, (draft: any) => {
            if (draft?.data) {
              const rides = Array.isArray(draft.data) ? draft.data : draft.data.rides || [];
              const filteredRides = rides.filter((ride: any) => ride._id !== id);
              if (Array.isArray(draft.data)) {
                draft.data = filteredRides;
              } else {
                draft.data.rides = filteredRides;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["RIDE", "AVAILABLE_RIDES"], // Add AVAILABLE_RIDES tag
    }),

    rejectRideRequest: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/ride/${id}/driver-reject`,
        method: "PATCH",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistically remove the ride from available rides
        const patchResult = dispatch(
          rideApi.util.updateQueryData('getAvailableRides', undefined, (draft: any) => {
            if (draft?.data) {
              const rides = Array.isArray(draft.data) ? draft.data : draft.data.rides || [];
              const filteredRides = rides.filter((ride: any) => ride._id !== id);
              if (Array.isArray(draft.data)) {
                draft.data = filteredRides;
              } else {
                draft.data.rides = filteredRides;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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

    // Additional endpoints for dashboard
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

    getDriverRideHistory: builder.query({
      query: (params: any) => ({
        url: "/ride/driver-history",
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
      query: (params?: any) => {
        console.log("Fetching rides with params:", params);
        return {
          url: "/ride-request",
          method: "GET",
          params: params,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Ride requests API response:", data);
        } catch (error) {
          console.error("Ride requests API error:", error);
        }
      },
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

    getUserActiveRideRequests: builder.query({
      query: () => ({
        url: "/ride-request/user/active",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    updateRideStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/ride-request/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["RIDE"],
    }),

    assignDriver: builder.mutation({
      query: ({ rideId, driverId }: { rideId: string; driverId: string }) => ({
        url: `/ride-request/${rideId}/assign-driver`,
        method: "PATCH",
        data: { driverId },
      }),
      invalidatesTags: ["RIDE"],
    }),

    deleteRide: builder.mutation({
      query: (id: string) => ({
        url: `/ride/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RIDE"],
    }),

    getAvailableRides: builder.query({
      query: () => ({
        url: '/ride/available',
        method: 'GET',
      }),
      providesTags: ["RIDE", "AVAILABLE_RIDES"],
    }),

  }),
});

export const {
  useCreateRideTypeMutation,
  useGetRideTypesQuery,
  useDeleteRideTypeMutation,
  useUpdateRideTypeMutation,
  useCreateRideMutation,
  useGetRidesQuery,
  useGetRideByIdQuery,
  useUpdateRideMutation,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
  useCancelRideMutation,
  useEstimateFareMutation,
  useGetEarningsDataQuery,
  useGetRideHistoryQuery,
  useGetDriverRideHistoryQuery,
  useGetRideAnalyticsQuery,
  useGetRideRequestsQuery,
  useGetOngoingRidesQuery,
  useGetUserRideQuery,
  useGetUserActiveRideRequestsQuery,
  useUpdateRideStatusMutation,
  useAssignDriverMutation,
  useDeleteRideMutation,
  useGetAvailableRidesQuery,
} = rideApi;
