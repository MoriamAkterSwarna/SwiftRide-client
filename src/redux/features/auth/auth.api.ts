/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type {
  ILogin,
  ILoginResponse,
  IOtpResponse,
  IRegister,
  IRegisterResponse,
  ISendOtp,
  IVerifyOtp,
} from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IRegisterResponse, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    login: builder.mutation<ILoginResponse, ILogin>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOtp: builder.mutation<IOtpResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IOtpResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation, useSendOtpMutation, useVerifyOtpMutation } =
  authApi;
