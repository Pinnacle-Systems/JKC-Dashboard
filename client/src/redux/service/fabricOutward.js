import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, FABRIC_OUTWARD } from "../../constants/apiUrl";

const fabricOutward = createApi({
  reducerPath: "fabricOutward",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["FabricOutward"],
  endpoints: (builder) => ({
    getFabOutCust: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutCust`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/getFabricOutward`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardCusDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardCustomer`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabOutByCusName: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutByCusName`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardQuarterDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutwardByQuarter`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardQuarterNameDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutwardByQuarterName`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardMonthDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardByMonth`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardCusByMonthDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardCusByMonth`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardMonthDate: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardByMonthDate`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardYearCompare: builder.query({
          query: ({ params }) => {
            return {
              url: `${FABRIC_OUTWARD}/fabricOutwardYearCompare`,
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              params,
            };
          },
          providesTags: ["FabricOutward"],
    }),
    getFabricOutwardQuarterCompare: builder.query({
          query: ({ params }) => {
            return {
              url: `${FABRIC_OUTWARD}/fabricOutwardQuarterCompare`,
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              params,
            };
          },
          providesTags: ["FabricOutward"],
    }),
    getFabricOutwardStateDetail: builder.query({
    query: ({ params }) => {
            return {
              url: `${FABRIC_OUTWARD}/fabricOutwardState`,
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              params,
            };
          },
          providesTags: ["FabricOutward"],
    }),
    getFabricOutwardStateDetailTrans: builder.query({
    query: ({ params }) => {
            return {
              url: `${FABRIC_OUTWARD}/fabricOutwardStateDetail`,
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              params,
            };
          },
          providesTags: ["FabricOutward"],
    }),
    getFabricOutwardStateDropdown: builder.query({
          query: ({ params }) => {
            return {
              url: `${FABRIC_OUTWARD}/fabricOutwardStateDropdown`,
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              params,
            };
          },
          providesTags: ["FabricOutward"],
    }),
    getFabricOutwardProcess: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardProcess`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardProcessDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardProcessDetail`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardProcessDropdown: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardProcessDropdown`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
  }),
});

export const {
  useGetFabOutCustQuery,
  useGetFabricOutwardDetailQuery,
  useGetFabricOutwardCusDetailQuery,
  useGetFabOutByCusNameQuery,
  useGetFabricOutwardQuarterDetailQuery,
  useGetFabricOutwardQuarterNameDetailQuery,
  useGetFabricOutwardMonthDetailQuery,
  useGetFabricOutwardCusByMonthDetailQuery,
  useGetFabricOutwardMonthDateQuery,
  useGetFabricOutwardQuarterCompareQuery,
  useGetFabricOutwardYearCompareQuery,
  useGetFabricOutwardStateDetailQuery,
  useGetFabricOutwardStateDetailTransQuery,
  useGetFabricOutwardStateDropdownQuery,
  useGetFabricOutwardProcessQuery,
  useGetFabricOutwardProcessDetailQuery,
  useGetFabricOutwardProcessDropdownQuery,
} = fabricOutward;

export default fabricOutward;
