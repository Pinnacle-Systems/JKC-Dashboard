import { Box, Grid, Typography } from "@mui/material"
import Trophy from "../maindashboard/Trophy.js"
import StatisticsCard from "../maindashboard/StatisticsCard.js"
import CardStatisticsVerticalComponent from "../../components/CardStatsVertical.js";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Poll } from "@mui/icons-material";
import { useGetPurchaseOrderLoadDataQuery } from "../../redux/service/purchaseOrder.js";
import DashboardHeader from "./DashboardHeader.jsx";
import { useGetFinYearQuery } from "../../redux/service/misDashboardService.js";
import { useState } from "react";
import SupplierDetails from "./Supplier/SupplierDetails.jsx";
import SupplierDetailsMonth from "./Supplier/SupplierDetailsMonth.jsx";
import RejectedPO from "./InComplete/RejectedPO.jsx";
import FinYear from "../../components/FinYear";
import PendingPO from "./InComplete/PendingPO.jsx";

const PurchaseDashboard = ({ year }) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectMonths, setSelectMonths] = useState("");
  const { data: finYear } = useGetFinYearQuery()
  const {
    data: loadData,
    isFetching,
    isLoading,
  } = useGetPurchaseOrderLoadDataQuery({
    params: {
    },
  });
  return (
    <div className="">
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, ml: 1 }}
          >
            Overview of Purchase Order
          </Typography>

          {/* RIGHT FILTERS */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <div className="flex items-center">
              <select
                value={selectedYear}
                autoFocus={true}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full px-2 py-1 text-xs border border-blue-800 rounded-md 
      transition-all duration-200 ring-1 `}                            >
                {finYear?.data?.map((option) => (
                  <option key={option.finYear} value={option.finYear}>
                    {option.finYear}
                  </option>
                ))}
              </select>
            </div>
            <FinYear
              selectedYear={selectedYear}
              selectmonths={selectMonths}
              setSelectmonths={setSelectMonths}
              autoSelect={true}
            />
          </Box>
        </Box>

      </div>
      <Grid container spacing={1} gap={1} sx={{ marginTop: 1 }}>
        {/* <Grid container sx={{ paddingX: 1 }}>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="warning"
              // trendNumber="+42%"
              title="Orders"
              subtitle="Current Month Orders"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardStatisticsVerticalComponent
              stats="$78"
              title="Received"
              trend="negative"
              color="info"
              // trendNumber="-15%"
              subtitle="Received POs"
              icon={<ImportExportIcon />}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="primary"
              // trendNumber="+42%"
              title="Pending"
              subtitle="Pending POs"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<CurrencyUsd />}
              color="success"
              // trendNumber="+42%"
              title="Expense"
              subtitle="Past Month Expense"
            />
          </Grid>

        </Grid> */}
        <Grid container spacing={1} sx={{ marginX: 1 }}>
          <Grid item xs={12} md={6}>
            <SupplierDetails selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SupplierDetailsMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RejectedPO selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PendingPO selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default PurchaseDashboard