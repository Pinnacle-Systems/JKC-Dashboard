import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PO_REGISTER } from "../../constants/apiUrl";


const poRegister = createApi({
    reducerPath: 'poRegister',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['PoRegister'],
    endpoints: (builder) => ({
        getPoRegister: builder.query({
            query: () => {
                return {
                    url: PO_REGISTER,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            },
            providesTags: ['PoRegister'],
        }),

    }),
})

export const {
    useGetPoRegisterQuery,
} = poRegister;

export default poRegister;