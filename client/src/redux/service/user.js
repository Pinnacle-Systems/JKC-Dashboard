import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, LOGIN_API, USERS_API } from "../../constants/apiUrl";
import { SetHeader } from "./HeaderSet"
// import { getCompCodeData } from "../../../../src/services/commonMasters.service";

const UsersApi = createApi({
    reducerPath: "loginUser",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        //  prepareHeaders: async (headers) => {
        //     await SetHeader(headers)
        //     return headers
        // }

    }),
    tagTypes: ["Login"],
    endpoints: (builder) => ({


        loginUser: builder.mutation({
            query: (payload) => ({
                url: LOGIN_API,
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["Login"],
        }),
        getUsers: builder.query({
            query: () => {

                return {
                    url: USERS_API,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },

                };
            },
            providesTags: ["Users"],
        }),
         getFname: builder.query({
            query: ({params}) => {

                return {
                    url: `${USERS_API}/fname`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    params

                };
            },
            providesTags: ["Fname"],
        }),
        createUser: builder.mutation({
            query: (payload) => ({
                url: USERS_API,
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["Login"],
        }),

        getUserBasicDetails: builder.query({
            query: (params) => {
                return {
                    url: `${USERS_API}/getUserBasicDetails`,
                    method: "GET",
                    params,
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        // compcode:COMPCODE
                    },

                };
            },
            providesTags: ["/getUserBasicDetails"],
        }),
        getuserdetail: builder.query({
            query: (params) => {
                return {
                    url: `${USERS_API}/getuserdetail`,
                    method: "GET",
                    params,
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        // compcode:COMPCODE
                    },

                };
            },
            providesTags: ["/getuserdetail"],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url:`${USERS_API}?id=${id}`,
                method: "DELETE",
            
            
            }),
            invalidatesTags: ["Login"],
        }),
        UpdateuserOnPage:
        builder.mutation({
            query: (payload) => ({
                url: USERS_API + "/updateUserOnPage",
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["UpdateRoleonPage"],
        }),
        AddCompany:builder.mutation({
            query: (payload) => ({
                url: USERS_API + "/addcompany",
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["AddCompany"],
        }),
         getuserone: builder.query({
            query: (id) => {
                return {
                    url: `${USERS_API}/${id}`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        // compcode:COMPCODE
                    },

                };
            },
            providesTags: ["getuserone"],
        }),



    }),
});

export const {
    useLoginUserMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useGetUserBasicDetailsQuery,
    useGetuserdetailQuery,
    useDeleteUserMutation,
    useUpdateuserOnPageMutation,
    useAddCompanyMutation,useGetuseroneQuery,useGetFnameQuery
} = UsersApi;

export default UsersApi;
