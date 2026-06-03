import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, TAReport } from "../../constants/apiUrl";

const purchase = createApi({
  reducerPath: "TAReport",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["TAReport"],
  endpoints: (builder) => ({
    getTaReportOrderCount: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTAReportOrderCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
    getTaReportOrderMdCount: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTAReportOrderMdCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
    getTaReportOrderCountByCompany: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTaReportOrderCountByCompany",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
    getTaReport: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTAReport",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
    getTaMdReport: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTaMdReport",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
    getTaMdReportDropdown: builder.query({
      query: ({ params }) => {
        return {
          url: TAReport + "/getTaMdReportDropdown",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["TAReport"],
    }),
  }),
});

export const {
  useGetTaReportOrderCountQuery,
  useGetTaReportOrderMdCountQuery,
  useGetTaReportOrderCountByCompanyQuery,
  useGetTaReportQuery,
  useGetTaMdReportDropdownQuery,
  useGetTaMdReportQuery,
} = purchase;

export default purchase;
