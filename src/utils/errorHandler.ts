/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility functions for handling API errors and validation
 */

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
  data?: any;
}

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: any): string => {
  // RTK Query error
  if (error?.data?.message) {
    return error.data.message;
  }

  // Standard error response
  if (error?.message) {
    return error.message;
  }

  // Network error
  if (error?.status === 0) {
    return "Network error. Please check your connection.";
  }

  // Fallback
  return "An unexpected error occurred. Please try again.";
};

/**
 * Extract validation errors from response
 */
export const getValidationErrors = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (error?.data?.errors) {
    if (Array.isArray(error.data.errors)) {
      error.data.errors.forEach((err: any) => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    } else if (typeof error.data.errors === "object") {
      Object.assign(errors, error.data.errors);
    }
  }

  if (error?.data?.fieldErrors) {
    Object.assign(errors, error.data.fieldErrors);
  }

  return errors;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return (
    error?.data?.errors ||
    error?.data?.fieldErrors ||
    (error?.status === 400 && error?.data?.message?.includes("validation"))
  );
};

/**
 * Check if error is unauthorized
 */
export const isUnauthorizedError = (error: any): boolean => {
  return error?.status === 401 || error?.data?.statusCode === 401;
};

/**
 * Check if error is forbidden
 */
export const isForbiddenError = (error: any): boolean => {
  return error?.status === 403 || error?.data?.statusCode === 403;
};

/**
 * Check if error is not found
 */
export const isNotFoundError = (error: any): boolean => {
  return error?.status === 404 || error?.data?.statusCode === 404;
};

/**
 * Check if error is a server error
 */
export const isServerError = (error: any): boolean => {
  return (
    error?.status >= 500 || (error?.data?.statusCode && error.data.statusCode >= 500)
  );
};

/**
 * Format error response for user display
 */
export const formatErrorResponse = (
  error: any
): { message: string; errors?: Record<string, string> } => {
  const message = getErrorMessage(error);
  const errors = getValidationErrors(error);

  return {
    message,
    ...(Object.keys(errors).length > 0 && { errors }),
  };
};

/**
 * Handle API error with appropriate action
 */
export const handleApiError = (
  error: any,
  options?: {
    showToast?: boolean;
    onUnauthorized?: () => void;
    onForbidden?: () => void;
    onServerError?: () => void;
  }
): { message: string; errors?: Record<string, string> } => {
  if (isUnauthorizedError(error)) {
    options?.onUnauthorized?.();
  }

  if (isForbiddenError(error)) {
    options?.onForbidden?.();
  }

  if (isServerError(error)) {
    options?.onServerError?.();
  }

  return formatErrorResponse(error);
};
