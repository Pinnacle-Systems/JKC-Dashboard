import { Router } from "express";

import {
  getTAReport,
  getOrderEntryTACount,
  getOrderEntryTACountByCompany,
} from "../services/taReport.service.js";

const router = Router();

router.get("/getTAReportOrderCount", getOrderEntryTACount);
router.get("/getTaReportOrderCountByCompany", getOrderEntryTACountByCompany);
router.get("/getTAReport", getTAReport);

export default router;
