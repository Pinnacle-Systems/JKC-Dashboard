import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, SHIPMENT_STATUS } from "../../constants/apiUrl";

const shipmentStatus = createApi({
  reducerPath: "shipmentStatus",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["shipmentStatus"],
  endpoints: (builder) => ({
    getOrderEntryShipmentCount: builder.query({
      query: ({ params }) => {
        return {
          url: SHIPMENT_STATUS + "/getOrderEntryShipmentCount",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["shipmentStatus"],
    }),

    getOrderEntryShipmentReport: builder.query({
      query: ({ params }) => {
        return {
          url: SHIPMENT_STATUS + "/getOrderEntryShipmentReport",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["shipmentStatus"],
    }),
  }),
});

export const {
  useGetOrderEntryShipmentCountQuery,

  useGetOrderEntryShipmentReportQuery,
} = shipmentStatus;

export default shipmentStatus;
