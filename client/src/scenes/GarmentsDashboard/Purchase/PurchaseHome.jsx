import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import FinYear from "../../../components/FinYear";

import Form from "./MonthWiseReport";
import RawMeterialWiseReport from "./RawMeterialWiseReport";
import ItemGroupWise from "./ItemGroupWise";
import TopTenSupplierYear from "./TopTenSupplierYear";
import QuarterWise from "./QuarterWise";
import MonthChart from "./MonthChart";
import TopTenItemsYear from "./TopTenItems";
import {
  setSelectedYear,
  setFilterBuyer,
  setSelectMonths,
  setPoType,
} from "../../../redux/features/dashboardFiltersSlice";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";
import SupplierDelay from "./SupplierDelay";
import { useEffect, useRef, useState } from "react";
import SupplierEfficiency from "./SupplierEfficiency";

const PurchaseHome = ({ companyName, autoFocusBuyer, filterBuyerList }) => {
  const dispatch = useDispatch();
  const buyerRef = useRef();
  // Redux state
  const { selectedYear, filterBuyer, selectMonths, finYr, poType } =
    useSelector((state) => state.dashboardFilters);
  const [focusBuyer, setFocusBuyer] = useState(false);
  const [chartToshow, setChartToShow] = useState("month");
  const { data: companyList } = useGetCompanyQuery(
    { params: { selectedYear } },
    { skip: !selectedYear },
  );
  console.log(selectedYear, filterBuyer, "checking");

  useEffect(() => {
    setFocusBuyer(true);

    return () => setFocusBuyer(false);
  }, []); // runs when page/tab is entered
  const purchaseTypeOptions = [
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Year", value: "year" },
  ];
  return (
    <>
      {/* Header and Filters */}
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          // alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Grid item md={5}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textAlign: "start", pt: 0.5, ml: 1 }}
            >
              Overview of Purchase - {filterBuyer}
            </Typography>
          </Grid>

          {/* RIGHT FILTERS GROUP */}
          <Grid
            item
            md={7}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2, // space between button group & selects
              pt: 0.5,
              pb: 0.4,
            }}
          >
            {/* 🔵 PO TYPE BUTTON GROUP */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {["All", "General", "Order"].map((type) => (
                <button
                  key={type}
                  onClick={() => dispatch(setPoType(type))}
                  className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md transition-all ${
                    poType === type
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </Box>

            {/* 🟡 DROPDOWNS */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {/* YEAR */}
              <select
                value={selectedYear || ""}
                onChange={(e) => dispatch(setSelectedYear(e.target.value))}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Year</option>
                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              {/* COMPANY */}
              <select
                ref={buyerRef}
                value={filterBuyer || ""}
                onChange={(e) => dispatch(setFilterBuyer(e.target.value))}
                autoFocus={focusBuyer}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Company</option>
                {/* {companyList?.data.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>
                    {item.COMPCODE}
                  </option>
                ))} */}
                <option value="JKC">JKC</option>
              </select>
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Child Components */}

      <Grid container className="">
        <Grid item xs={12} md={12}>
          {chartToshow === "year" ? (
            <>
              <Form
                key={filterBuyer}
                companyName={filterBuyer}
                finYear={selectedYear}
                finYr={finYr}
                poType={poType}
                companyList={companyList}
                filterBuyerList={filterBuyerList}
                purchaseTypeOptions={purchaseTypeOptions}
                setChartToShow={setChartToShow}
                chartToshow={chartToshow}
              />
            </>
          ) : chartToshow === "month" ? (
            <>
              <MonthChart
                key={filterBuyer}
                companyName={filterBuyer}
                finYear={selectedYear}
                finYr={finYr}
                poType={poType}
                companyList={companyList}
                filterBuyerList={filterBuyerList}
                purchaseTypeOptions={purchaseTypeOptions}
                setChartToShow={setChartToShow}
                chartToshow={chartToshow}
              />
            </>
          ) : (
            <>
              <QuarterWise
                key={filterBuyer}
                companyName={filterBuyer}
                finYear={selectedYear}
                finYr={finYr}
                poType={poType}
                companyList={companyList}
                filterBuyerList={filterBuyerList}
                purchaseTypeOptions={purchaseTypeOptions}
                setChartToShow={setChartToShow}
                chartToshow={chartToshow}
              />
            </>
          )}
        </Grid>
      </Grid>

      <Grid container className="">
        <Grid item xs={12} md={6}>
          <TopTenSupplierYear
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopTenItemsYear
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <RawMeterialWiseReport
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType} companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid> */}
      </Grid>

      <Grid container className="">
        <Grid item xs={12} md={6}>
          <SupplierEfficiency
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SupplierDelay
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
      </Grid>

      {poType !== "Order" && (
        <>
          <Grid container className="">
            <Grid item xs={12} md={12}>
              <ItemGroupWise
                key={filterBuyer}
                companyName={filterBuyer}
                finYear={selectedYear}
                finYr={finYr}
                poType={poType}
                companyList={companyList}
                filterBuyerList={filterBuyerList}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default PurchaseHome;
