import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PURCHASE } from "../../constants/apiUrl";

const purchaseTable = createApi({
  reducerPath: "purchaseTable",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["purchaseTable"],
  endpoints: (builder) => ({
    getGeneralYear: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGeneralYear",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierGeneralTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGeneralTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getQuarterwiseGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGeneralTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGreyYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseDyedYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGreyFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseDyedFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseAccessoryTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getMonthwiseGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGeneralTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGreyYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseDyedYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGreyFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseDyedFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseAccessoryTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getItemNameTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getItemNameTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getTopTenItemGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGeneralTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getSupplierDelayedgeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedgeneralTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),
    getSupplierDelayedGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    getSupplierDelayedDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    getSupplierDelayedGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    getSupplierDelayedDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    getSupplierDelayedAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),
    getSupplierDelayedGreyYarnListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedGreyYarnListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    // Dyed Yarn
    getSupplierDelayedDyedYarnListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedDyedYarnListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    // Grey Fabric
    getSupplierDelayedGreyFabricListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedGreyFabricListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    // Dyed Fabric
    getSupplierDelayedDyedFabricListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedDyedFabricListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),

    // Accessory
    getSupplierDelayedAccessoryListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierDelayedAccessoryListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierDelayTable"],
    }),
    // ===================== General =====================
    getSupplierEfficiencyGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyGeneralTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Grey Yarn =====================
    getSupplierEfficiencyGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Dyed Yarn =====================
    getSupplierEfficiencyDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Grey Fabric =====================
    getSupplierEfficiencyGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Dyed Fabric =====================
    getSupplierEfficiencyDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Accessory =====================
    getSupplierEfficiencyAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Grey Yarn List =====================
    getSupplierEfficiencyGreyYarnListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyGreyYarnListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Dyed Yarn List =====================
    getSupplierEfficiencyDyedYarnListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyDyedYarnListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Grey Fabric List =====================
    getSupplierEfficiencyGreyFabricListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyGreyFabricListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Dyed Fabric List =====================
    getSupplierEfficiencyDyedFabricListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyDyedFabricListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),

    // ===================== Accessory List =====================
    getSupplierEfficiencyAccessoryListTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getSupplierEfficiencyAccessoryListTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["supplierTable"],
    }),
  }),
});

export const {
  useGetGeneralYearQuery,
  useGetGreyYarnTableQuery,
  useGetDyedYarnTableQuery,
  useGetGreyFabricTableQuery,
  useGetDyedFabricTableQuery,
  useGetAccessoryTableQuery,
  useGetTopTenSupplierGeneralTableQuery,
  useGetTopTenSupplierGreyYarnTableQuery,
  useGetTopTenSupplierDyedYarnTableQuery,
  useGetTopTenSupplierGreyFabricTableQuery,
  useGetTopTenSupplierDyedFabricTableQuery,
  useGetTopTenSupplierAccessoryTableQuery,
  useGetTopTenSupplierListGreyYarnTableQuery,
  useGetTopTenSupplierListDyedYarnTableQuery,
  useGetTopTenSupplierListDyedFabricTableQuery,
  useGetTopTenSupplierListGreyFabricTableQuery,
  useGetTopTenSupplierListAccessoryTableQuery,
  useGetQuarterwiseGeneralTableQuery,
  useGetQuarterwiseGreyYarnTableQuery,
  useGetQuarterwiseDyedYarnTableQuery,
  useGetQuarterwiseGreyFabricTableQuery,
  useGetQuarterwiseDyedFabricTableQuery,
  useGetQuarterwiseAccessoryTableQuery,
  useGetMonthwiseGeneralTableQuery,
  useGetMonthwiseGreyYarnTableQuery,
  useGetMonthwiseDyedYarnTableQuery,
  useGetMonthwiseGreyFabricTableQuery,
  useGetMonthwiseDyedFabricTableQuery,
  useGetMonthwiseAccessoryTableQuery,
  useGetItemNameTableQuery,
  useGetTopTenItemGeneralTableQuery,
  useGetTopTenItemGreyYarnTableQuery,
  useGetTopTenItemDyedYarnTableQuery,
  useGetTopTenItemGreyFabricTableQuery,
  useGetTopTenItemDyedFabricTableQuery,
  useGetTopTenItemAccessoryTableQuery,
  useGetTopTenItemListGreyYarnTableQuery,
  useGetTopTenItemListGreyFabricTableQuery,
  useGetTopTenItemListDyedYarnTableQuery,
  useGetTopTenItemListDyedFabricTableQuery,
  useGetTopTenItemListAccessoryTableQuery,
  useGetSupplierDelayedgeneralTableQuery,
  useGetSupplierDelayedGreyYarnTableQuery,
  useGetSupplierDelayedDyedYarnTableQuery,
  useGetSupplierDelayedGreyFabricTableQuery,
  useGetSupplierDelayedDyedFabricTableQuery,
  useGetSupplierDelayedAccessoryTableQuery,
  useGetSupplierDelayedGreyYarnListTableQuery,
  useGetSupplierDelayedGreyFabricListTableQuery,
  useGetSupplierDelayedDyedYarnListTableQuery,
  useGetSupplierDelayedDyedFabricListTableQuery,
  useGetSupplierDelayedAccessoryListTableQuery,
  useGetSupplierEfficiencyGeneralTableQuery,
  useGetSupplierEfficiencyGreyYarnTableQuery,
  useGetSupplierEfficiencyDyedYarnTableQuery,
  useGetSupplierEfficiencyGreyFabricTableQuery,
  useGetSupplierEfficiencyDyedFabricTableQuery,
  useGetSupplierEfficiencyAccessoryTableQuery,
  useGetSupplierEfficiencyGreyYarnListTableQuery,
  useGetSupplierEfficiencyGreyFabricListTableQuery,
  useGetSupplierEfficiencyDyedYarnListTableQuery,
  useGetSupplierEfficiencyDyedFabricListTableQuery,
  useGetSupplierEfficiencyAccessoryListTableQuery,
} = purchaseTable;

export default purchaseTable;
