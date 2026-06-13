import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, ATTENDENCE } from "../../constants/apiUrl";

const attendence = createApi({
  reducerPath: "attendence",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["attendence"],
  endpoints: (builder) => ({
    getAttendenceCount: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getAttendenceCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
    getAttendenceDistributionCount: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getAttendenceDistributionCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
    getAttendenceTable: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getAttendenceTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
    getAttendenceDesignationCount: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getAttendenceDesignationCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
    getAttendenceDesignationTable: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getAttendenceDesignationTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
    getDesignation: builder.query({
      query: ({ params }) => {
        return {
          url: ATTENDENCE + "/getDesignation",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["attendence"],
    }),
  }),
});

export const {
  useGetAttendenceCountQuery,
  useGetAttendenceDistributionCountQuery,
  useGetAttendenceTableQuery,
  useGetAttendenceDesignationCountQuery,
  useGetAttendenceDesignationTableQuery,
  useGetDesignationQuery,

  // table
} = attendence;

export default attendence;
