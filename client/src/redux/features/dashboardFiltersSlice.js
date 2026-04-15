import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedYear: "26-27",
  filterBuyer: null,
  selectMonths: [],
  finYr: null,
  user: null,
  lastSection: null, // ✅ NEW
  poType: "All",
};

const dashboardFiltersSlice = createSlice({
  name: "dashboardFilters",
  initialState,
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setFilterBuyer: (state, action) => {
      state.filterBuyer = action.payload;
    },
    setSelectMonths: (state, action) => {
      state.selectMonths = action.payload;
    },
    setFinYr: (state, action) => {
      state.finYr = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLastSection: (state, action) => {
      state.lastSection = action.payload;
    },
    setPoType: (state, action) => {
      state.poType  = action.payload;
    },
    resetDashboardFilters: () => initialState,
  },
});

export const {
  setSelectedYear,
  setFilterBuyer,
  setSelectMonths,
  setFinYr,
  setUser,
  setLastSection,
  resetDashboardFilters,setPoType
} = dashboardFiltersSlice.actions;

export default dashboardFiltersSlice.reducer;
