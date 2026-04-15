import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import {
  useGetYearlyCompQuery,
} from "../../../redux/service/misDashboardService";
import { ColorContext } from "../../global/context/ColorContext";
import FinYear from "../../../components/FinYear";
import { useGetFinYrQuery } from "../../../redux/service/poData";

const HeaderFilter = ({ companyName, Year, selectedmonth, autoFocusBuyer }) => {
  const { color } = useContext(ColorContext);
  const theme = useTheme();

  const [filterBuyer, setFilterBuyer] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState(Year);
  const [selectMonths, setSelectMonths] = useState(selectedmonth || "");

  const { data: result } = useGetYearlyCompQuery({ params: {} });
  const { data: finYr } = useGetFinYrQuery();

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  useEffect(() => {
    setSelectMonths(selectedmonth || "");
  }, [selectedmonth]);

  const filterBuyerList =
    result?.data?.map((item) => ({
      compname: item.customer,
      id: item.customer,
    })) || [];

  return (
      <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        whiteSpace: "nowrap",
      }}
    >
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
      >
     

        {/* RIGHT: FILTERS */}
        <Grid item md={7}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            wrap="nowrap"
          >
            {/* Financial Year */}
            <Grid item>
              <DropdownWithSearch
                options={finYr?.data || []}
                labelField="finYr"
                value={selectedYear}
                setValue={setSelectedYear}
              />
            </Grid>

            {/* Month Selector */}
            <Grid item>
              <FinYear
                selectedYear={selectedYear}
                selectmonths={selectMonths}
                setSelectmonths={setSelectMonths}
                autoFocusBuyer={autoFocusBuyer}
              />
            </Grid>

            {/* Company Dropdown */}
            <Grid item>
              <DropdownWithSearch
                options={filterBuyerList}
                labelField="compname"
                value={filterBuyer}
                setValue={setFilterBuyer}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeaderFilter;
