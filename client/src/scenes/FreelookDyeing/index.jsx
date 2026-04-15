import { Grid } from "@mui/material"
import DashboardHeader from "./DashboardHeader.js"
import Trophy from "../maindashboard/Trophy.js"
import StatisticsCard from "../maindashboard/StatisticsCard.js"
import CardStatisticsVerticalComponent from "../../components/CardStatsVertical.js";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Poll } from "@mui/icons-material";
import OverallFabricInward from "./OverallFabricInward.jsx";
import FabricOutward from "./FabricOutward/FabricOutward.jsx";
import TotalPurchase from "./TotalPurchase.jsx";
import { getCommonParams } from "../../utils/hleper.js";

const index = () => {
    
  return (
    <div className="w-full  mx-auto rounded-md shadow-lg py-1 overflow-y-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <DashboardHeader />
        </Grid>
        <Grid item xs={12} md={4}>
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
        <Grid container  columnSpacing={2} sx={{ mt: 2, paddingX: 2 }}>
          <Grid item xs={12} md={4}>
            <OverallFabricInward />
          </Grid>
          <Grid item xs={12} md={4}>
            <FabricOutward />
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalPurchase />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default index