import type { ComponentType } from "react";

export type { ISendOtp, ILogin, IRegister, IVerifyOtp } from "./auth.type";
export type { IDivision, IDistrict, IRideType, IRide } from "./ride.type";

export interface IOtpResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IRegisterResponse {
  name: string;
  email: string;
  password: string;
  role: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  auth: IAuthResponse[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  provider: string;
  providerId: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUserResponse;
  };
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  auth: IAuthResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component?: ComponentType;
    isExternal?: boolean;
  }[];
}

export type TRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "RIDER"
  | "USER"
  | "PUBLIC"
  | "DRIVER";
