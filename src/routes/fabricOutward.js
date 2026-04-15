import { Router } from "express";
import {
  getFabOutCust,
  getFabOutwardProcessDropdown,
  getFabOutwardStateDropdown,
  getFabricOutward,
  getFabricOutwardByMonth,
  getFabricOutwardByMonthDate,
  getFabricOutwardByQuarter,
  getFabricOutwardByQuarterName,
  getFabricOutwardCusByMonth,
  getFabricOutwardCustomer,
  getFabricOutwardCustomerByName,
  getFabricOutwardProcess,
  getFabricOutwardProcessByName,
  getFabricOutwardQuarterCompare,
  getFabricOutwardState,
  getFabricOutwardStateDetail,
  getFabricOutwardYearCompare,
} from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/fabOutCust", getFabOutCust);

router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);
router.get("/fabOutByCusName", getFabricOutwardCustomerByName);

router.get("/fabOutwardByQuarter", getFabricOutwardByQuarter);
router.get("/fabOutwardByQuarterName", getFabricOutwardByQuarterName);

router.get("/fabricOutwardByMonth", getFabricOutwardByMonth);
router.get("/fabricOutwardCusByMonth", getFabricOutwardCusByMonth);

router.get("/fabricOutwardByMonthDate", getFabricOutwardByMonthDate);

router.get("/fabricOutwardYearCompare",getFabricOutwardYearCompare);
router.get("/fabricOutwardQuarterCompare",getFabricOutwardQuarterCompare);

router.get("/fabricOutwardState", getFabricOutwardState);
router.get("/fabricOutwardStateDetail", getFabricOutwardStateDetail);
router.get("/fabricOutwardStateDropdown", getFabOutwardStateDropdown);

router.get("/fabricOutwardProcess", getFabricOutwardProcess);
router.get("/fabricOutwardProcessDetail", getFabricOutwardProcessByName);
router.get("/fabricOutwardProcessDropdown", getFabOutwardProcessDropdown);

export default router;
