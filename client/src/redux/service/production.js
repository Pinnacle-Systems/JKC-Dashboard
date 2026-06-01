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
    getProductionTable: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionSummaryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionSummaryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEfficiency: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEfficiency",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEfficiencyManpower: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEfficiencyManpower",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEfficiencyManpowertable: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEfficiencyManpowertable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEff: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEff",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEfftable: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEfftable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["production"],
    }),
    getProductionEfficiencyTable: builder.query({
      query: ({ params }) => {
        return {
          url: PRODUCTION + "/getProductionEfficiencyTable",
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
  useGetProductionTableQuery,
  useGetProductionSummaryTableQuery,
  useGetProductionEfficiencyQuery,
  useGetProductionEfficiencyTableQuery,
  useGetProductionEffQuery,
  useGetProductionEfficiencyManpowerQuery,
  useGetProductionEfficiencyManpowertableQuery,
  useGetProductionEfftableQuery,
  // table
} = production;

export default production;
