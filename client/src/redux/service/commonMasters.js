import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, COMMON_MAST } from "../../constants/apiUrl";


const commonMast = createApi({
    reducerPath: 'commonMast',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['commonMast'],
    endpoints: (builder) => ({
        getFinYear: builder.query({
            query: () => {
                return {
                    url: COMMON_MAST,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['commonMast'],
        }),
        getBuyerName: builder.query({
            query: () => {
                return {
                    url: `${COMMON_MAST}/getBuyer`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['commonMast'],
        }),
        getMonth: builder.query({
            query: ({ params }) => {
                return {
                    url: `${COMMON_MAST}/getMonth`,
                    method: 'GET',
                    params,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['commonMast'],
        }),
        getCompCodeData: builder.query({
            query: (params ) => {
                return {
                    url: `${COMMON_MAST}/getCompCodeData`,
                    method: 'GET',
                    params,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['commonMast'],
        }),
    }),
})

export const {
    useGetFinYearQuery,
    useGetBuyerNameQuery,
    useGetMonthQuery,
    useGetCompCodeDataQuery,
} = commonMast;

export default commonMast;