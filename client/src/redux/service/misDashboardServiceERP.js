import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, MIS_DASHBOARDERP } from "../../constants/apiUrl";


const MisDashboard = createApi({
    reducerPath: 'misDashboardServiceERP',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['MisDashboard'],
    endpoints: (builder) => ({
        getMisDashboard: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpCustomerWise: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/customerWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpCustomerWiseBreakup: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/customerWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpCountryWise: builder.query({
            query: ({ params }) => {
             
                
                return {
                    url: MIS_DASHBOARDERP + "/countryWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpCountryWiseBreakUp: builder.query({
            query: ({ params }) => {
                
                
                return {
                    url: MIS_DASHBOARDERP + "/countryWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpStyleItemWise: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/StyleItemWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpStyleItemWiseBreakUp: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/StyleItemWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpMonthWise: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/MonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpMonthWiseBreakUP: builder.query({
            query: ({ params }) => {
                console.log(params,"receivedparams");
                
                return {
                    url: MIS_DASHBOARDERP + "/MonthWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpQuarterWise: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/QuarterWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpQuarterWiseBreakUp: builder.query({
            query: ({ params }) => {
                
                return {
                    url: MIS_DASHBOARDERP + "/QuarterWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpYearWise: builder.query({
            query: ({ params }) => {
                console.log(params,"receivedparams");
                
                return {
                    url: MIS_DASHBOARDERP + "/YearWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpYearWiseBreakUp: builder.query({
            query: ({ params }) => {
                console.log(params,"receivedparams");
                
                return {
                    url: MIS_DASHBOARDERP + "/YearWiseBreakUp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardErpSingleMonthWise: builder.query({
            query: ({ params }) => {                
                return {
                    url: MIS_DASHBOARDERP + "/SingleMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardOrdersInHand: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/ordersInHand",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardOrdersInHandMonthWise: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/ordersInHandMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardActualVsBudgetValueMonthWise: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/actualVsBudgetValueMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getYearlyCompERP: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/yearlyComp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        executeProcedure: builder.mutation({
            query: () => ({
              url: MIS_DASHBOARDERP + "/execute-procedure",
              method:  "PUT",
            }),
          }),
        getBuyerWiseRevenue: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/buyerWiseRev",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getBudgetVsActual: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/actualVsBudget",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
       
        getShortShipmantRatio: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/shortShipment",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),

    }),
})

export const {
    useGetMisDashboardQuery,
    useGetMisDashboardErpCustomerWiseQuery,
    useGetMisDashboardErpCustomerWiseBreakupQuery,
    useGetMisDashboardErpCountryWiseQuery,
    useGetMisDashboardErpCountryWiseBreakUpQuery,
    useGetMisDashboardErpStyleItemWiseQuery,
    useGetMisDashboardErpStyleItemWiseBreakUpQuery,
    useGetMisDashboardErpMonthWiseQuery,
    useGetMisDashboardErpMonthWiseBreakUPQuery,
    useGetMisDashboardErpQuarterWiseQuery,
    useGetMisDashboardErpQuarterWiseBreakUpQuery,
    useGetMisDashboardErpYearWiseQuery,
    useGetMisDashboardErpYearWiseBreakUpQuery,
    useGetMisDashboardErpSingleMonthWiseQuery,
    useGetMisDashboardOrdersInHandQuery,
    useGetMisDashboardOrdersInHandMonthWiseQuery,
    useGetMisDashboardActualVsBudgetValueMonthWiseQuery,
    useGetYearlyCompERPQuery,
    useExecuteProcedureMutation,
    useGetBuyerWiseRevenueQuery,
    useGetBudgetVsActualQuery,
    useGetShortShipmantRatioQuery

} = MisDashboard;

export default MisDashboard;