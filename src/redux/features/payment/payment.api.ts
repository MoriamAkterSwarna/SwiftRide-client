/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initPayment: builder.mutation<any, string>({
      query: (rideId: string) => ({
        url: `/payment/init-payment/${rideId}`,
        method: "POST",
      }),
      invalidatesTags: ["RIDE", "PAYMENT"],
    }),

    validatePayment: builder.mutation<any, any>({
      query: (data) => ({
        url: "/payment/validate-payment",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["RIDE", "PAYMENT"],
    }),

    getInvoice: builder.query<any, string>({
      query: (paymentId: string) => ({
        url: `/payment/invoice/${paymentId}`,
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),

    getPaymentHistory: builder.query<any, void>({
      query: () => ({
        url: "/payment/history",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),

    getAllPayments: builder.query<any, void>({
      query: () => ({
        url: "/payment/all",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
  }),
});

export const {
  useInitPaymentMutation,
  useValidatePaymentMutation,
  useGetInvoiceQuery,
  useGetPaymentHistoryQuery,
  useGetAllPaymentsQuery,
} = paymentApi;
