import { configureStore } from "@reduxjs/toolkit";
import { openTabs } from "./features";
import dashboardFiltersReducer from "./features/dashboardFiltersSlice";

import {
  poRegister,
  commonMast,
  supplier,
  poData,
  misDashboardService,
  ordManagement,
  UsersApi,
  misDashboardServiceERP,
  RoleApi,
  freeLookFabric,
  fabricOutward,
  purchaseOrder,
  purchase,
  purchaseTable,
} from "./service";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    openTabs,
    dashboardFilters: dashboardFiltersReducer,

    [poRegister.reducerPath]: poRegister.reducer,
    [commonMast.reducerPath]: commonMast.reducer,
    [misDashboardServiceERP.reducerPath]: misDashboardServiceERP.reducer,
    [supplier.reducerPath]: supplier.reducer,
    [poData.reducerPath]: poData.reducer,
    [misDashboardService.reducerPath]: misDashboardService.reducer,
    [ordManagement.reducerPath]: ordManagement.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [RoleApi.reducerPath]: RoleApi.reducer,
    [freeLookFabric.reducerPath]: freeLookFabric.reducer,
    [fabricOutward.reducerPath]: fabricOutward.reducer,
    [purchaseOrder.reducerPath]: purchaseOrder.reducer,
    [purchase.reducerPath]: purchase.reducer,
    [purchaseTable.reducerPath] : purchaseTable.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      poRegister.middleware,
      commonMast.middleware,
      supplier.middleware,
      poData.middleware,
      misDashboardService.middleware,
      ordManagement.middleware,
      misDashboardServiceERP.middleware,
      UsersApi.middleware,
      RoleApi.middleware,
      freeLookFabric.middleware,
      fabricOutward.middleware,
      purchaseOrder.middleware,
      purchase.middleware,
      purchaseTable.middleware,
    ]),
});

setupListeners(store.dispatch);
