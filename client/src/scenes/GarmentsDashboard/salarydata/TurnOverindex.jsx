
import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import FinYear from "../../../components/FinYear";
import EmpType1 from "./CustomerWisereport";
import CountryWisereport from "../CountryWise/CountryWiseReport";
import ItemWisereport from './ItemWisereport'
import MonthWise from './MonthWiseReport'
import QuarterWise from './QuarterWiseReport'
import YearWise from './YearWise'
import { setSelectedYear, setFilterBuyer, setSelectMonths } from "../../../redux/features/dashboardFiltersSlice";
import { useEffect, useRef, useState } from "react";

const TurnOverIndex = ({ companyName, autoFocusBuyer, filterBuyerList, }) => {

  const dispatch = useDispatch();
  const buyerRef = useRef();
  // Redux state
  const { selectedYear, filterBuyer, selectMonths, finYr } = useSelector((state) => state.dashboardFilters);
  const [focusBuyer, setFocusBuyer] = useState(false);

  useEffect(() => {
    setFocusBuyer(true);

    return () => setFocusBuyer(false);
  }, []); // runs when page/tab is entered

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
              Overview of TurnOver Distribution - {filterBuyer}
            </Typography>
          </Grid>

          {/* RIGHT FILTERS GROUP */}
          <Grid
            item
            md={7}
            sx={{
              display: "flex",
              justifyContent: "flex-end", // push the group to the right
              alignItems: "center",
              pt: 0.5,
              pb: 0.4
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* FIN YEAR */}
              {/* <DropdownWithSearch
                options={finYr?.data || []}
                labelField="finYr"
                label=""
                value={selectedYear}
                setValue={(val) => dispatch(setSelectedYear(val))}
              /> */}
              <select
                value={selectedYear || ""}
                onChange={(e) => dispatch(setSelectedYear(e.target.value))}
                className="w-full px-2 py-1 text-xs border-2   rounded-md 
      border-blue-600 transition-all duration-200"
              >
                <option value="">Select Year</option>

                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>


              {/* MONTH */}
              <FinYear
                selectedYear={selectedYear}
                selectmonths={selectMonths}
                setSelectmonths={(val) => dispatch(setSelectMonths(val))}
                autoFocusBuyer={autoFocusBuyer}
              />

              {/* COMPANY FILTER */}
              {/* <DropdownWithSearch
                key={filterBuyer}
                ref={buyerRef}
                options={filterBuyerList || []}
                labelField="compname"
                label=""
                value={filterBuyer}

                className="w-full px-2 py-1 text-xs rounded-md"
                setValue={(val) => dispatch(setFilterBuyer(val))}
                autoFocus={focusBuyer} /> */}
              <select
                ref={buyerRef}
                value={filterBuyer || ""}
                onChange={(e) => dispatch(setFilterBuyer(e.target.value))}
                autoFocus={focusBuyer}
         className="w-full px-2 py-1 text-xs border-2   rounded-md 
      border-blue-600 transition-all duration-200"              >
                <option value="">Select Company</option>

                {(filterBuyerList || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.compname}
                  </option>
                ))}
              </select>

            </Box>
          </Grid>
        </Grid>


      </div>

      {/* Child Components */}
      <Grid container className="" >
        <Grid item xs={12} md={7}>
          <EmpType1 key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear} finYr={finYr} filterBuyerList={filterBuyerList}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <CountryWisereport companyName={filterBuyer} finYear={selectedYear} key={filterBuyer} finYr={finYr} filterBuyerList={filterBuyerList}/>
        </Grid>
      </Grid>
      <Grid container spacing={3}  >
        <Grid item xs={12} md={12}>
          <ItemWisereport key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear} finYr={finYr} filterBuyerList={filterBuyerList}
          />
        </Grid>
      </Grid>


      <Grid container className="" >
        <Grid item xs={12} md={12}>
          <MonthWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear} finYr={finYr} filterBuyerList={filterBuyerList}
          />
        </Grid>

      </Grid>


      <Grid container className="" >
        <Grid item xs={12} md={6}>
          <QuarterWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear} finYr={finYr} filterBuyerList={filterBuyerList}
          />
        </Grid>


        <Grid item xs={12} md={6}>
          <YearWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear} finYr={finYr} filterBuyerList={filterBuyerList}
          />
        </Grid>



      </Grid>

    </>

  );
};

export default TurnOverIndex;
