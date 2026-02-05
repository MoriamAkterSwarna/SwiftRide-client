/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Notification/Toast utilities for displaying messages to users
 */

import { toast } from "sonner";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a success notification
 */
export const notifySuccess = (
  message: string,
  options?: NotificationOptions
) => {
  toast.success(message, {
    duration: options?.duration || 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * Show an error notification
 */
export const notifyError = (
  message: string,
  options?: NotificationOptions
) => {
  toast.error(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * Show an info notification
 */
export const notifyInfo = (
  message: string,
  options?: NotificationOptions
) => {
  toast.info(message, {
    duration: options?.duration || 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * Show a warning notification
 */
export const notifyWarning = (
  message: string,
  options?: NotificationOptions
) => {
  toast.warning(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * Show a loading notification
 */
export const notifyLoading = (message: string) => {
  return toast.loading(message);
};

/**
 * Update a notification
 */
export const updateNotification = (
  id: string | number,
  type: NotificationType,
  message: string,
  options?: NotificationOptions
) => {
  const updateFn = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  }[type];

  updateFn(message, {
    id,
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * Dismiss a notification
 */
export const dismissNotification = (id: string | number) => {
  toast.dismiss(id);
};

/**
 * Dismiss all notifications
 */
export const dismissAllNotifications = () => {
  toast.dismiss();
};

/**
 * Utility to handle API responses with notifications
 */
export const handleApiResponse = (
  promise: Promise<any>,
  messages?: {
    loading?: string;
    success?: string;
    error?: string;
  }
) => {
  const toastId = messages?.loading
    ? toast.loading(messages.loading)
    : undefined;

  return promise
    .then((response) => {
      if (messages?.success) {
        if (toastId) {
          updateNotification(toastId, "success", messages.success);
        } else {
          notifySuccess(messages.success);
        }
      } else if (toastId) {
        toast.dismiss(toastId);
      }
      return response;
    })
    .catch((error) => {
      const errorMessage =
        messages?.error || error?.message || "An error occurred";
      if (toastId) {
        updateNotification(toastId, "error", errorMessage);
      } else {
        notifyError(errorMessage);
      }
      throw error;
    });
};
