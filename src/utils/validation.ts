/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { AxiosError } from "axios";

/**
 * Form Validation Utilities
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Accepts various phone formats
  const phoneRegex = /^[\d\s\-\\(\\)\\+]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRideForm = (data: {
  pickup?: string;
  destination?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.pickup || data.pickup.trim().length === 0) {
    errors.pickup = "Pickup location is required";
  }

  if (!data.destination || data.destination.trim().length === 0) {
    errors.destination = "Destination is required";
  }

  if (data.pickup && data.destination && data.pickup === data.destination) {
    errors.destination = "Pickup and destination cannot be the same";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * API Error Handling
 */

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An error occurred";

    return message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const handleApiErrorWithToast = (error: unknown, defaultMessage = "An error occurred") => {
  const message = handleApiError(error) || defaultMessage;
  toast.error(message);
  return message;
};

/**
 * API Response Handlers
 */

export const handleApiSuccess = (message: string, duration = 3000) => {
  toast.success(message, { duration });
};

/**
 * Form Field Validators
 */

export const fieldValidators = {
  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    if (!validateEmail(value)) {
      return "Invalid email address";
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    if (!validatePhone(value)) {
      return "Invalid phone number";
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} cannot exceed ${max} characters`;
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    const { isValid, errors } = validatePassword(value);
    if (!isValid) {
      return errors[0]; // Return first error
    }
    return null;
  },

  match: (value: string, matchValue: string, fieldName: string): string | null => {
    if (!value || !matchValue) return null;
    if (value !== matchValue) {
      return `${fieldName} does not match`;
    }
    return null;
  },

  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return "Invalid URL";
    }
  },

  creditCard: (value: string): string | null => {
    if (!value) return null;
    const cleaned = value.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) {
      return "Invalid credit card number";
    }
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) {
      return "Invalid credit card number";
    }
    return null;
  },
};

/**
 * Form Error Display Helper
 */

export const getFieldError = (
  errors: Record<string, any>,
  fieldName: string
): string | null => {
  if (!errors || !errors[fieldName]) {
    return null;
  }

  const error = errors[fieldName];
  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return null;
};

/**
 * API Status Codes
 */

export const handleHttpError = (statusCode: number): string => {
  const errorMessages: Record<number, string> = {
    400: "Bad request. Please check your input.",
    401: "You are not authenticated. Please log in.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "Conflict. This resource already exists.",
    422: "Validation failed. Please check your input.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Service temporarily unavailable. Please try again later.",
    503: "Service is under maintenance. Please try again later.",
  };

  return errorMessages[statusCode] || "An error occurred. Please try again.";
};

/**
 * Safe JSON Parse
 */

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Async Form Handler
 */

export const handleAsyncFormSubmit = async (
  fn: () => Promise<void>,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  try {
    await fn();
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    const message = handleApiError(error);
    toast.error(message);
    if (onError) {
      onError(message);
    }
  }
};
