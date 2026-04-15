// import {
//   Box,
//   Typography,
//   Avatar,
//   Button, Stack
// } from "@mui/material";
// import { DropdownWithSearch } from "../../input/inputcomponent";
// import FinYear from "../../components/FinYear";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

// const DashboardHeader = ({ filterBuyer, setFilterBuyer, selectedYear, setSelectedYear,
//   selectMonths, setSelectMonths, filterBuyerList, finYr, user }) => {

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         px: 2,
//         py: 2,
//         backgroundColor: "#fff",
//         borderBottom: "1px solid #eee",
//       }}
//     >
//       {/* LEFT : USER */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//         <Avatar
//           alt="Adrian"
//           src="/images/avatars/1.png" // change to your avatar image path
//           sx={{ width: 56, height: 56 }}
//         />
//         <Box>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Welcome Back, {user || "SuperAdmin"}<span style={{ fontSize: '1.2rem' }}>👋</span>
//           </Typography>
         
//         </Box>
//       </Box>

//       {/* RIGHT : OVERVIEW + FILTERS */}
//       <Stack direction="row" spacing={2}>

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,

//             whiteSpace: "nowrap",
//           }}
//         >


//           {/* FIN YEAR */}
//           <DropdownWithSearch
//             options={finYr?.data || []}
//             labelField="finYr"
//             value={selectedYear}
//             setValue={setSelectedYear}
//           />

//           {/* MONTH */}
//           <FinYear
//             selectedYear={selectedYear}
//             selectmonths={selectMonths}
//             setSelectmonths={setSelectMonths}
//           // autoFocusBuyer={autoFocusBuyer}
//           />

//           {/* COMPANY */}
//           <DropdownWithSearch
//             options={filterBuyerList}
//             labelField="compname"
//             value={filterBuyer}
//             setValue={setFilterBuyer}
//           />
//         </Box>      </Stack>


//     </Box>
//   );
// };

// export default DashboardHeader;

// import { Box, Typography, Avatar, Stack } from "@mui/material";
// import { DropdownWithSearch } from "../../input/inputcomponent";
// import FinYear from "../../components/FinYear";
// import { useSelector, useDispatch } from "react-redux";
// import { setFilterBuyer, setSelectedYear, setSelectMonths } from "../../redux/features/dashboardFiltersSlice";

// const DashboardHeader = ({ filterBuyerList, finYr, user }) => {
//   const dispatch = useDispatch();

//   // Redux state
//   const { filterBuyer, selectedYear, selectMonths } = useSelector(
//     (state) => state.dashboardFilters
//   );

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         px: 2,
//         py: 2,
//         backgroundColor: "#fff",
//         borderBottom: "1px solid #eee",
//       }}
//     >
//       {/* LEFT : USER */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Avatar
//           alt="Adrian"
//           src="/images/avatars/1.png" // change to your avatar image path
//           sx={{ width: 56, height: 56 }}
//         />
//         <Box>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Welcome Back, {user || "SuperAdmin"} <span style={{ fontSize: "1.2rem" }}>👋</span>
//           </Typography>
//         </Box>
//       </Box>

//       {/* RIGHT : OVERVIEW + FILTERS */}
//       <Stack direction="row" spacing={2}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {/* FIN YEAR */}
//           <DropdownWithSearch
//             options={finYr?.data || []}
//             labelField="finYr"
//             value={selectedYear}
//             setValue={(val) => dispatch(setSelectedYear(val))}
//           />

//           {/* MONTH */}
//           <FinYear
//             selectedYear={selectedYear}
//             selectmonths={selectMonths}
//             setSelectmonths={(val) => dispatch(setSelectMonths(val))}
//           />

//           {/* COMPANY */}
//           <DropdownWithSearch
//             options={filterBuyerList || []}
//             labelField="compname"
//             value={filterBuyer}
//             setValue={(val) => dispatch(setFilterBuyer(val))}
//           />
//         </Box>
//       </Stack>
//     </Box>
//   );
// };

// export default DashboardHeader;
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { DropdownWithSearch } from "../../input/inputcomponent";
import FinYear from "../../components/FinYear";

const DashboardHeader = ({
  filterBuyerList,
  finYr,
  user,
  filterBuyer,
  selectedYear,
  selectMonths,
  onFilterBuyerChange,
  onYearChange,
  onMonthChange,usernames
}) => {
    console.log(finYr, "kjddlfjlkdr");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 2,
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* LEFT : USER */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          alt="User"
          src="/images/avatars/1.png"
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Welcome Back, {usernames || "SuperAdmin"}<span style={{ fontSize: '1.2rem' }}>👋</span>
        </Typography>
      </Box>

      {/* RIGHT : FILTERS */}
      <Stack direction="row" spacing={2}>
        {/* FIN YEAR */}
        <DropdownWithSearch
          options={finYr?.data || []}
          labelField="finYear"
          value={selectedYear}
          setValue={onYearChange}
        />

        {/* MONTH */}
        {/* <FinYear
          selectedYear={selectedYear}
          selectmonths={selectMonths}
          setSelectmonths={onMonthChange}
        /> */}

        {/* COMPANY */}
        {/* <DropdownWithSearch
          options={filterBuyerList || []}
          labelField="compname"
          value={filterBuyer}
          setValue={onFilterBuyerChange}
        /> */}
      </Stack>
    </Box>
  );
};

export default DashboardHeader;
