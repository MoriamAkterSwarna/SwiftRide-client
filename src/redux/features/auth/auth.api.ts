
import { baseApi } from "@/redux/baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    sendOtp: builder.mutation({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),

    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserInfo: builder.mutation({
      query: (data) => ({
        url: "/user/me",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),

  }),
});
export const { useRegisterMutation, useLoginMutation, useSendOtpMutation, useVerifyOtpMutation , useUserInfoQuery, useLogoutMutation, useUpdateUserInfoMutation, useUpdatePasswordMutation} =
  authApi;
