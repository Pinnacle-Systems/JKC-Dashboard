import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, SUPPLIER } from "../../constants/apiUrl";


const supplier = createApi({
    reducerPath: 'supplier',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['Supplier'],
    endpoints: (builder) => ({
        getSupplier: builder.query({
            query: () => {
                return {
                    url: SUPPLIER,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['Supplier'],
        }),

    }),
})

export const {
    useGetSupplierQuery,
} = supplier;

export default supplier;