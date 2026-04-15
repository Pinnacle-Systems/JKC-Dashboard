import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PURCHASE } from "../../constants/apiUrl";

const purchase = createApi({
  reducerPath: "purchase",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["purchase"],
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getCompany",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getPurchase: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getPurchase",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getCombinedPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getCombinedPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getYearPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getYearPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getYearPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getYearPurchaseGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getYearPurchaseCombinedCOMP: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getYearPurchaseCombinedCOMP",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getQuarterPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getQuarterPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getQuarterPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getQuarterPurchaseGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getQuarterPurchaseCombinedCOMP: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getQuarterPurchaseCombinedCOMP",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getMonthPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMonthPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getMonthGeneralPurchase: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMonthGeneralPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getMonthCombinedPurchase: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMonthCombinedPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getTopTenSupplier: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getTopTenSupplierPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getTopTenSupplierCombined: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierCombined",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getRawMaterialWise: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMaterialWise",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getItemGroupWise: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getItemGroupWise",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getTopTenItems: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenItemsOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getTopTenItemsPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenItemsGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getTopTenItemsCombined: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenItemsCombined",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getSupplierDelay: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierDelayOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getSupplierDelayPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierDelayGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getSupplierDelayCombined: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierDelayCombined",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),

    getSupplierEfficiency: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierEfficiencyOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getSupplierEfficiencyPurchaseGeneral: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierEfficiencyGeneral",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getSupplierEfficiencyCombined: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getSupplierEfficiencyCombined",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
  }),
});

export const {
  useGetPurchaseQuery,
  useGetCompanyQuery,
  useGetCombinedPurchaseOrderQuery,

  useGetPurchaseOrderQuery,
  useGetYearPurchaseGeneralQuery,
  useGetYearPurchaseCombinedCOMPQuery,
  useGetYearPurchaseOrderQuery,

  useGetQuarterPurchaseOrderQuery,
  useGetQuarterPurchaseGeneralQuery,
  useGetQuarterPurchaseCombinedCOMPQuery,

  useGetMonthPurchaseOrderQuery,
  useGetMonthGeneralPurchaseQuery,
  useGetMonthCombinedPurchaseQuery,

  useGetTopTenSupplierQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
  useGetTopTenSupplierCombinedQuery,

  useGetRawMaterialWiseQuery,
  useGetItemGroupWiseQuery,

  useGetTopTenItemsQuery,
  useGetTopTenItemsPurchaseGeneralQuery,
  useGetTopTenItemsCombinedQuery,

  useGetSupplierDelayCombinedQuery,
  useGetSupplierDelayPurchaseGeneralQuery,
  useGetSupplierDelayQuery,

  useGetSupplierEfficiencyQuery,
  useGetSupplierEfficiencyCombinedQuery,
  useGetSupplierEfficiencyPurchaseGeneralQuery,
} = purchase;

export default purchase;
