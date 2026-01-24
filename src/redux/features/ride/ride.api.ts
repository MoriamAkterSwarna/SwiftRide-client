/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type {
  IDivision,
  IDistrict,
  IRideType,
  IRide,
  IOtpResponse,
} from "@/types";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Division endpoints
    createDivision: builder.mutation<IOtpResponse<IDivision>, FormData>({
      query: (data:any) => ({
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

    // District endpoints
    createDistrict: builder.mutation<
      IOtpResponse<IDistrict>,
      Partial<IDistrict>
    >({
      query: (data : any) => ({
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
  }),
});

export const {
  useCreateDivisionMutation,
  useGetDivisionsQuery,
  useCreateDistrictMutation,
  useGetDistrictsQuery,
  useCreateRideTypeMutation,
  useGetRideTypesQuery,
  useCreateRideMutation,
  useGetRidesQuery,
} = rideApi;
