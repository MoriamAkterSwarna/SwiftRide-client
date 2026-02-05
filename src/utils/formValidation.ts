/**
 * Reusable form validation schemas using Zod
 */

import { z } from "zod";

/**
 * Common field validators
 */
export const validators = {
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  passwordWeak: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  phoneNumber: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
      message: "Please enter a valid phone number",
    }),

  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),

  url: z.string().url("Please enter a valid URL"),

  number: z
    .number()
    .min(0, "Must be a positive number"),

  positiveNumber: z
    .number()
    .min(1, "Must be greater than 0"),

  date: z
    .date()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "date",
          received: "undefined",
          message: "Please select a valid date",
        });
      }
    }),

  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
};

/**
 * Common form schemas
 */
export const formSchemas = {
  // Login
  login: z.object({
    email: validators.email,
    password: validators.passwordWeak,
  }),

  // Register
  register: z
    .object({
      name: validators.name,
      email: validators.email,
      password: validators.password,
      confirmPassword: z
        .string()
        .min(1, "Confirm password is required"),
      role: z.enum(["rider", "driver"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  // Change Password
  changePassword: z
    .object({
      currentPassword: validators.passwordWeak,
      newPassword: validators.password,
      confirmPassword: z
        .string()
        .min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }),

  // OTP Verification
  otpVerification: z.object({
    pin: validators.otp,
  }),

  // Update Profile
  updateProfile: z.object({
    name: validators.name,
    email: validators.email,
    phone: validators.phoneNumber.optional().or(z.literal("")),
  }),

  // Ride Request
  rideRequest: z.object({
    pickupLocation: z
      .string()
      .min(1, "Pickup location is required")
      .min(3, "Pickup location must be at least 3 characters"),
    dropoffLocation: z
      .string()
      .min(1, "Dropoff location is required")
      .min(3, "Dropoff location must be at least 3 characters"),
    vehicleType: z
      .enum(["economy", "comfort", "premium"])
      .optional(),
    paymentMethod: z
      .enum(["card", "wallet", "cash", "mobile"])
      .optional(),
  }),

  // Emergency Contact
  emergencyContact: z.object({
    name: validators.name,
    phone: validators.phoneNumber,
    relationship: z
      .string()
      .min(1, "Relationship is required")
      .max(30),
  }),

  // Driver Application
  driverApplication: z.object({
    licenseNumber: z
      .string()
      .min(1, "License number is required")
      .min(5, "License number must be at least 5 characters"),
    licenseExpiry: validators.date,
    vehicleNumber: z
      .string()
      .min(1, "Vehicle number is required")
      .min(5, "Vehicle number must be at least 5 characters"),
    vehicleModel: z
      .string()
      .min(1, "Vehicle model is required")
      .min(3, "Vehicle model must be at least 3 characters"),
    insuranceNumber: z
      .string()
      .min(1, "Insurance number is required")
      .min(5, "Insurance number must be at least 5 characters"),
  }),
};

/**
 * Get schema type for a form
 */
export type LoginFormData = z.infer<typeof formSchemas.login>;
export type RegisterFormData = z.infer<typeof formSchemas.register>;
export type ChangePasswordFormData = z.infer<typeof formSchemas.changePassword>;
export type OTPVerificationData = z.infer<typeof formSchemas.otpVerification>;
export type UpdateProfileFormData = z.infer<typeof formSchemas.updateProfile>;
export type RideRequestData = z.infer<typeof formSchemas.rideRequest>;
export type EmergencyContactData = z.infer<typeof formSchemas.emergencyContact>;
export type DriverApplicationData = z.infer<typeof formSchemas.driverApplication>;
