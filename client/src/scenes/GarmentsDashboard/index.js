import Grid from "@mui/material/Grid";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import CardStatisticsVerticalComponent from "../../components/CardStatsVertical.js";
import Trophy from "../../scenes/GarmentsDashboard/Trophy.js";
import StatisticsCard from "../../scenes/maindashboard/StatisticsCard.js";
import { Poll } from "@mui/icons-material";
import DashboardHeader from "./DashboardHeader.js";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HeadCount from "./Headcount/HeadCount.jsx";
import HomeAttrition from "./Attrition/HomeAttrition.jsx";
import HomePF from "./PFdata/HomePF.jsx";
import TurnOver from "./salarydata/TurnOver.jsx";
import PurchaseIndex from "./Purchase/index.jsx";
import { useGetYearlyCompQuery } from "../../redux/service/misDashboardService";
import { useEffect, useLayoutEffect, useState } from "react";
import { getCommonParams } from "../../utils/hleper";
import { useGetFnameQuery } from "../../redux/service/user";
import { useGetFinYearQuery } from "../../redux/service/misDashboardService";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedYear,
  setFilterBuyer,
  setSelectMonths,
  setFinYr,
  setLastSection,
  setPoType,
} from "../../redux/features/dashboardFiltersSlice";
import { useGetuserpagesQuery } from "../../redux/service/Rolemaster.js";
const GarmentsDashboard = () => {
  const dispatch = useDispatch();
  const {
    filterBuyer,
    selectedYear,
    selectMonths,
    finYr,
    lastSection,
    poType,
  } = useSelector((state) => state.dashboardFilters);
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    if (typeof lastSection === "number") {
      setTimeout(() => {
        window.scrollTo({
          top: lastSection,
          behavior: "smooth",
        });
      }, 300); // wait for charts & layout
    }
  }, []);

  const params = getCommonParams();
  const { isSuperAdmin, employeeId, userId } = params;
  const { data: allPages } = useGetuserpagesQuery({ params: { userId } });
  const usernames = [...new Set(allPages?.map((item) => item.username))].join(
    ", ",
  );
  console.log(allPages, "allPages");
  console.log(usernames, "checkingname");

  const { data: userName } = useGetFnameQuery({
    params: { employeeId },
  });

  useEffect(() => {
    if (!isSuperAdmin && userName?.data?.length) {
      const usernameObj = userName.data.find((x) => x.userName);
      if (usernameObj) setUser(usernameObj.userName);
    }
  }, [isSuperAdmin, userName]);

  /* ---------------- FILTER STATE ---------------- */
  // const [filterBuyer, setFilterBuyer] = useState('');
  // const [selectedYear, setSelectedYear] = useState('25-26');
  // const [selectMonths, setSelectMonths] = useState( "");
  const { data: finYrData } = useGetFinYearQuery();
  console.log(finYrData, "finYrData");

  const { data: result } = useGetYearlyCompQuery({ params: {} });
  useEffect(() => {
    if (finYrData?.data?.length) {
      dispatch(setFinYr(finYrData));

      // ✅ auto select latest year ONLY ONCE
      if (!selectedYear) {
        dispatch(setSelectedYear(finYrData?.data[0]));
      }
    }
  }, [finYrData, dispatch, selectedYear]);
  console.log(finYr, "finYr");

  // useEffect(() => {
  //   setFilterBuyer(companyName);
  // }, [companyName]);

  // useEffect(() => {
  //   setSelectMonths(selectedmonth || "");
  // }, [selectedmonth]);

  const filterBuyerList =
    result?.data
      ?.map((item) => ({
        compname: item.customer,
        id: item.customer,
      }))
      ?.filter((item) => ["AGF", "VEL"]?.includes(item.compname)) || [];
  const filterBuyerListPurchase =
    result?.data?.map((item) => ({
      compname: item.customer,
      id: item.customer,
    })) || [];
  console.log(filterBuyerList, "compnaycheck");

  return (
    <div className="w-full  mx-auto rounded-md shadow-lg py-1 overflow-y-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <DashboardHeader
            filterBuyer={filterBuyer}
            selectedYear={selectedYear}
            selectMonths={selectMonths}
            finYr={finYr}
            usernames={usernames}
            user={user}
            onFilterBuyerChange={(val) => dispatch(setFilterBuyer(val))}
            onYearChange={(val) => dispatch(setSelectedYear(val))}
            onMonthChange={(val) => dispatch(setSelectMonths(val))}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
        <Grid item xs={10} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1, ml: 1 }}>
          <Grid item xs={12} md={3}>
            <CardStatisticsVerticalComponent
              stats="$78"
              title="Revenue"
              trend="negative"
              color="secondary"
              trendNumber="-15%"
              subtitle="Past Month"
              icon={<CurrencyUsd />}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<ReceiptLongIcon />}
              color="success"
              trendNumber="+42%"
              title="Expense"
              subtitle="Weekly Profit"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="primary"
              trendNumber="+42%"
              title="Sales"
              subtitle="Weekly Profit"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="warning"
              trendNumber="+42%"
              title="Orders"
              subtitle="Weekly Profit"
            />
          </Grid>
        </Grid>

        {/* <Grid item xs={12} md={5}>
          <TurnOver
            filterBuyer={filterBuyer}
            selectedYear={selectedYear}
            selectMonths={selectMonths}
            finYr={finYr}
            user={user}
            onFilterBuyerChange={(val) => dispatch(setFilterBuyer(val))}
            onYearChange={(val) => dispatch(setSelectedYear(val))}
            onMonthChange={(val) => dispatch(setSelectMonths(val))}
            filterBuyerList={filterBuyerList}
            onOpen={() => dispatch(setLastSection("turnover"))}
          />
        </Grid> */}
        <Grid item xs={12} md={7}>
          <PurchaseIndex
            filterBuyer={filterBuyer}
            selectedYear={selectedYear}
            selectMonths={selectMonths}
            finYr={finYr}
            user={user}
            onFilterBuyerChange={(val) => dispatch(setFilterBuyer(val))}
            onYearChange={(val) => dispatch(setSelectedYear(val))}
            onMonthChange={(val) => dispatch(setSelectMonths(val))}
            filterBuyerList={filterBuyerListPurchase}
            poType={poType}
            setPoType={setPoType}
            onOpen={() => dispatch(setLastSection("purchase"))}
          />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <HomePF />
        </Grid>
        <Grid item xs={12} md={4}>
          <HeadCount />
        </Grid>
        <Grid item xs={12} md={4}>
          <HomeAttrition />
        </Grid> */}
        <Grid item xs={12} md={6}>
          {/* <HomeRegion /> */}
        </Grid>

        <Grid item xs={12} md={6}>
          {/* <Table /> */}
          {/* <HomeOTWages/> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default GarmentsDashboard;
