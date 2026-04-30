import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, ORDER_ENTRY } from "../../constants/apiUrl";

const purchase = createApi({
  reducerPath: "orderEntry",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["orderEntry"],
  endpoints: (builder) => ({
    getOrderEntryCount: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryStatus: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryStatus",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryBuyerStatus: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerStatus",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryStatusTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryStatusTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getfabricProcessPlanTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getfabricProcessPlanTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getAccessoriesPlanTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getAccessoriesPlanTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getCMTPlanTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getCMTPlanTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getPreBudjetTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getPreBudjetTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
       getOrderEntryBuyerWiseStatusTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerWiseStatusTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
  }),
});

export const {
  useGetOrderEntryCountQuery,
  useGetOrderEntryStatusQuery,
  useGetOrderEntryBuyerStatusQuery,
  useGetOrderEntryStatusTableQuery,
  useGetfabricProcessPlanTableQuery,
  useGetAccessoriesPlanTableQuery,
  useGetCMTPlanTableQuery,
  useGetPreBudjetTableQuery,useGetOrderEntryBuyerWiseStatusTableQuery
  
} = purchase;

export default purchase;
