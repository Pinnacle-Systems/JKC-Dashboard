import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PRODUCTION } from "../../constants/apiUrl";

const production = createApi({
  reducerPath: "production",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["production"],
  endpoints: (builder) => ({
    getProduction: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProduction",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
  }),
});

export const {
  useGetProductionQuery,
  // table
} = production;

export default production;
