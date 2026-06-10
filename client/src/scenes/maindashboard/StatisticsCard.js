import { useGetAttendenceCountQuery } from "../../redux/service/attendenceReport";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "../../redux/features/opentabs";
import { setFilterBuyer } from "../../redux/features/dashboardFiltersSlice";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

// ** Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import EventNoteIcon from "@mui/icons-material/EventNote";

const StatisticsCard = () => {
  const [company, setCompany] = useState("JKC");
  const dispatch = useDispatch();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const today = new Date();

  const [fromDate, setFromDate] = useState(formatDate(today));

  const { data: attendenceData, isLoading } = useGetAttendenceCountQuery(
    {
      params: {
        company,
        date: fromDate,
      },
    },
    {
      skip: !company || !fromDate,
    },
  );
  console.log(attendenceData, "attendenceData");

  const attendance = attendenceData?.data || {};

  const presentCount = attendance.PRESENT_COUNT || 0;
  const absentCount = attendance.ABSENT_COUNT || 0;
  const onDutyCount = attendance.ONDUTY_COUNT || 0;
  const weekOffCount = attendance.WEEKOFF_COUNT || 0;

  const totalEmployees =
    presentCount + absentCount + onDutyCount + weekOffCount;

  const presentPercentage =
    totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : 0;

  const salesData = [
    {
      stats: attendance.PRESENT_COUNT || 0,
      male: attendance.PRESENT_MALE || 0,
      female: attendance.PRESENT_FEMALE || 0,
      title: "Present",
      bgColor: "success.main",
      bgGradient:
        "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.15) 100%)",
      icon: <CheckCircleIcon sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: attendance.ONDUTY_COUNT || 0,
      male: attendance.ONDUTY_MALE || 0,
      female: attendance.ONDUTY_FEMALE || 0,
      title: "On Duty",
      bgColor: "#1976d2",
      bgGradient:
        "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.15) 100%)",
      icon: <AccessTimeIcon sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: attendance.ABSENT_COUNT || 0,
      male: attendance.ABSENT_MALE || 0,
      female: attendance.ABSENT_FEMALE || 0,
      title: "Absent",
      bgColor: "error.main",
      bgGradient:
        "linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(211, 47, 47, 0.15) 100%)",
      icon: <CancelIcon sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: attendance.WEEKOFF_COUNT || 0,
      male: attendance.WEEKOFF_MALE || 0,
      female: attendance.WEEKOFF_FEMALE || 0,
      title: "Week Off",
      bgColor: "grey.900",
      bgGradient:
        "linear-gradient(135deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.08) 100%)",
      icon: <EventNoteIcon sx={{ fontSize: "1.75rem" }} />,
    },
  ];

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: item.bgGradient,
            p: 1.5,
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.05)",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            },
          }}
          onClick={() => {
            dispatch(setFilterBuyer(company));
            dispatch(push({ 
              id: 18, 
              name: "Attendance Report", 
              data: { date: fromDate } 
            }));
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              mr: 2,
              width: 36,
              height: 36,
              boxShadow: 3,
              color: "common.white",
              backgroundColor: item.bgColor,
            }}
          >
            {item.icon}
          </Avatar>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {item.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "nowrap",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1,
                  minWidth: "fit-content",
                }}
              >
                {isLoading ? "..." : Number(item.stats).toLocaleString()}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#1976d2",
                }}
              >
                <MaleIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {item.male}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#e91e63",
                }}
              >
                <FemaleIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {item.female}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        title="Attendance Overview"
        action={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="JKC">JKC</option>
              </select>
            </FormControl>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
            />
          </Box>
        }
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Total {presentPercentage}% Present
            </Box>{" "}
            😎 today
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            fontWeight: 500,
            mb: 0.2,
          },
        }}
      />

      <CardContent
        sx={{
          pt: (theme) => `${theme.spacing(3)} !important`,
        }}
      >
        <Grid container spacing={3}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
