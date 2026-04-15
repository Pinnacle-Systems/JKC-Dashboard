import { Box, Grid, Typography } from "@mui/material"
import CustomerDetails from "./CustomerDetails"
import CustMonthDtl from "./CustMonthDtl"
import { useState } from "react"
import HouseIcon from '@mui/icons-material/House';
import FactoryIcon from '@mui/icons-material/Factory';
import FinYear from "../../../components/FinYear";
import CustQuarterDtl from "./CustQuarterDtl";
import MonthWiseCus from "./MonthWiseCus";
import DomainIcon from '@mui/icons-material/Domain';
import FabricMonthDate from "./FabricMonthDate";
import StateDetails from "./StateDtl";
import FabricInwardYearCompare from "./FabricInwardYearCompare";
import FabricInwardQuarterCompare from "./FabInwardQuarterCompare";
const FabricInward = ({ finYear, year, selectCategory }) => {
    const [category, setCategory] = useState(selectCategory);
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectmonths, setSelectmonths] = useState("");
    const handleFilterClick = (type) => {
        setCategory(type);
    };

    return (
        <>
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
                        Overview of Fabric Inward
                    </Typography>

                    {/* RIGHT FILTERS */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <div className="flex gap-2">
                            <div className="grid grid-cols-3 gap-3 p-1 justify-center">
                                <button
                                    onClick={() => handleFilterClick("INHOUSE")}
                                    className={`flex items-center gap-2 px-1.5 py-1 text-[11px] font-semibold rounded-full shadow-md transition-all 
        ${category === "INHOUSE"
                                            ? "bg-blue-600 text-white scale-105"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                >
                                    <HouseIcon fontSize="medium" /> INHOUSE
                                </button>
                                <button
                                    onClick={() => handleFilterClick("OUTSIDE")}
                                    className={`flex items-center gap-2 px-1.5 py-1 text-xs font-semibold rounded-full shadow-md transition-all 
        ${category === "OUTSIDE"
                                            ? "bg-blue-600 text-white scale-105"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                >
                                    <FactoryIcon fontSize="medium" /> OUTSIDE
                                </button>
                                <button
                                    onClick={() => handleFilterClick("ALL")}
                                    className={`flex items-center justify-center gap-2 px-1.5 py-1 text-xs font-semibold rounded-full shadow-md transition-all 
        ${category === "ALL"
                                            ? "bg-blue-600 text-white scale-105"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                >
                                    <DomainIcon fontSize="medium" /> ALL
                                </button>
                            </div>
                        </div>
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
                            selectmonths={selectmonths}
                            setSelectmonths={setSelectmonths}
                            autoSelect={true}
                        />
                    </Box>
                </Box>

            </div>
            <Grid container spacing={1} sx={{ p: 1, }}>
                <Grid item xs={12} md={8}>
                    <CustomerDetails selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <CustQuarterDtl selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustMonthDtl selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <MonthWiseCus selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <FabricMonthDate selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <FabricInwardYearCompare selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <FabricInwardQuarterCompare selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StateDetails selectedYear={selectedYear} setSelectedYear={setSelectedYear} category={category} finYear={finYear} setCategory={setCategory} selectmonths={selectmonths} setSelectmonths={setSelectmonths} />
                </Grid>
            </Grid>
        </>
    )
}

export default FabricInward
