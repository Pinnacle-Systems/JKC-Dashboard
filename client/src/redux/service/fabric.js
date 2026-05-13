import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, FABRIC } from "../../constants/apiUrl";

const fabricApi = createApi({
  reducerPath: "fabricApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["fabricApi"],
  endpoints: (builder) => ({
    getFabricStatus: builder.query({
      query: ({ params }) => {
        return {
          url: FABRIC + "/getFabricStatus",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["fabricApi"],
    }),
    getFabricStatusTable: builder.query({
      query: ({ params }) => {
        return {
          url: FABRIC + "/getFabricStatusTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["fabricApi"],
    }),
    getFabricPending: builder.query({
      query: ({ params }) => {
        return {
          url: FABRIC + "/getFabricPending",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["fabricApi"],
    }),
    getFabricPendingTable: builder.query({
      query: ({ params }) => {
        return {
          url: FABRIC + "/getFabricPendingTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["fabricApi"],
    }),
  }),
});

export const {
  useGetFabricStatusQuery,
  useGetFabricStatusTableQuery,
  useGetFabricPendingQuery,
  useGetFabricPendingTableQuery,
} = fabricApi;

export default fabricApi;
