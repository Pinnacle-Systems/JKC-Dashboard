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
    getOrderEntryBuyerWiseQty: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerWiseQty",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryBuyerWisePoNoQty: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerWisePoNoQty",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryStyleWiseQty: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryStyleWiseQty",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryColorWiseQty: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryColorWiseQty",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryProfitLossOrderNo: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryProfitLossOrderNo",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryProfitLossReport: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryProfitLossReport",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),

    // table

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
    getOrderEntryBuyerWiseStatusStyleTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerWiseStatusStyleTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryBuyerWiseQuantityTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerWiseQuantityTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryBuyerPoNoWiseStatusTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryBuyerPoNoWiseStatusTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryStyleWiseTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryStyleWiseTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryColorWiseTable: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryColorWiseTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["orderEntry"],
    }),
    getOrderEntryStatusTableWithStatus: builder.query({
      query: ({ params }) => {
        return {
          url: ORDER_ENTRY + "/getOrderEntryStatusTableWithStatus",
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
  useGetOrderEntryBuyerWiseQtyQuery,
  useGetOrderEntryBuyerWisePoNoQtyQuery,
  useGetOrderEntryStyleWiseQtyQuery,
  useGetOrderEntryColorWiseQtyQuery,
  useGetOrderEntryProfitLossOrderNoQuery,
  useGetOrderEntryProfitLossReportQuery,

  // table

  useGetOrderEntryStatusTableQuery,
  useGetfabricProcessPlanTableQuery,
  useGetAccessoriesPlanTableQuery,
  useGetCMTPlanTableQuery,
  useGetPreBudjetTableQuery,
  useGetOrderEntryStatusTableWithStatusQuery,
  useGetOrderEntryBuyerWiseQuantityTableQuery,
  useGetOrderEntryBuyerWiseStatusTableQuery,
  useGetOrderEntryBuyerPoNoWiseStatusTableQuery,
  useGetOrderEntryStyleWiseTableQuery,
  useGetOrderEntryColorWiseTableQuery,
  useGetOrderEntryBuyerWiseStatusStyleTableQuery,
} = purchase;

export default purchase;
