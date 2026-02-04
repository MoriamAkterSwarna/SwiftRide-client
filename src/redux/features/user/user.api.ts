import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User Profile endpoints
    getUserProfile: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/me",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/user/change-password",
        method: "PATCH",
        data,
      }),
    }),

    // Driver specific profile
    updateDriverProfile: builder.mutation({
      query: (data) => ({
        url: "/driver/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    getDriverProfile: builder.query({
      query: () => ({
        url: "/driver/profile",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    // Apply to become a driver
    applyAsDriver: builder.mutation({
      query: (data) => ({
        url: "/driver/create-driver",
        method: "POST",
        data,
      }),
      invalidatesTags: ["USER"],
    }),
    saveEmergencyContact: builder.mutation({
      query: (data) => ({
        url: "/user/emergency-contacts",
        method: "POST",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    getEmergencyContacts: builder.query({
      query: () => ({
        url: "/user/emergency-contacts",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateEmergencyContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/emergency-contacts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    deleteEmergencyContact: builder.mutation({
      query: (id) => ({
        url: `/user/emergency-contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),

    // Admin user management
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search, role, status }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search) params.append("search", search);
        if (role) params.append("role", role);
        if (status) params.append("status", status);
        return {
          url: `/admin/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["USER"],
    }),

    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    approveDriver: builder.mutation({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    suspendDriver: builder.mutation({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUpdateDriverProfileMutation,
  useGetDriverProfileQuery,
  useApplyAsDriverMutation,
  useSaveEmergencyContactMutation,
  useGetEmergencyContactsQuery,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  
  useSuspendDriverMutation,
} = userApi;
