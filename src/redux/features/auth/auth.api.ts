/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";


const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, { name: string; email: string; password: string }>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        body: userInfo,
      }),
    })
    
})
});
export const { useRegisterMutation,  } = authApi;