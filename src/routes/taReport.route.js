import { Router } from "express";

import {
  getTAReport,
  getOrderEntryTACount,
  getOrderEntryTAMdCount,
  getOrderEntryTACountByCompany,
  getOrderEntryTAMddropdown,
  getTAMdReport,
} from "../services/taReport.service.js";

const router = Router();

router.get("/getTAReportOrderCount", getOrderEntryTACount);
router.get("/getTAReportOrderMdCount", getOrderEntryTAMdCount);
router.get("/getTaReportOrderCountByCompany", getOrderEntryTACountByCompany);
router.get("/getTAReport", getTAReport);
router.get("/getTaMdReportDropdown", getOrderEntryTAMddropdown);
router.get("/getTaMdReport", getTAMdReport);

export default router;
