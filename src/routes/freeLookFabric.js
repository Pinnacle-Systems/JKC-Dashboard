import { Router } from "express";
import {
  getFabInwardStateDropdown,
  getFabricInward,
  getFabricInwardByMonth,
  getFabricInwardByMonthDate,
  getFabricInwardByQuarter,
  getFabricInwardByQuarterName,
  getFabricInwardCusByMonth,
  getFabricInwardCustomer,
  getFabricInwardCustomerByName,
  getFabricInwardFetchData,
  getFabricInwardMonthComapare,
  getFabricInwardQuarterComapare,
  getFabricInwardState,
  getFabricInwardStateDetail,
  getFabricInwardYearCompare,
  getFanInwardCust,
} from "../services/freeLookFabric.service.js";
import {
  getFabric,
} from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/", getFabric);
router.get("/fabInwardCust", getFanInwardCust);

router.get("/getFabricInward", getFabricInward);
router.get("/fabricInwardCustomer", getFabricInwardCustomer);
router.get("/fabricInwardByCusName", getFabricInwardCustomerByName);

router.get("/fabricInwardByMonth", getFabricInwardByMonth);
router.get("/fabricInwardCusByMonth", getFabricInwardCusByMonth);

router.get("/fabricInwardByQuarter", getFabricInwardByQuarter);
router.get("/fabricInwardByQuarterName", getFabricInwardByQuarterName);

router.get("/fabricInwardByMonthDate", getFabricInwardByMonthDate);

router.get("/fabricInwardState", getFabricInwardState);
router.get("/fabricInwardStateDetail", getFabricInwardStateDetail);
router.get("/fabricInwardStateDropdown", getFabInwardStateDropdown);

router.get("/fabricInwardYearCompare",getFabricInwardYearCompare)

router.get("/fabricInwardFetchData",getFabricInwardFetchData)

router.get("/fabricInwardQuarterCompare",getFabricInwardQuarterComapare)
router.get("/fabricInwardMonthCompare",getFabricInwardMonthComapare)

export default router;
