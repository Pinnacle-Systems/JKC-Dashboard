import { Router } from "express";

import {
  getTAReport,
  getOrderEntryTACount,
  getOrderEntryTAMdCount,
  getOrderEntryTACountByCompany,
} from "../services/taReport.service.js";

const router = Router();

router.get("/getTAReportOrderCount", getOrderEntryTACount);
router.get("/getTAReportOrderMdCount", getOrderEntryTAMdCount);
router.get("/getTaReportOrderCountByCompany", getOrderEntryTACountByCompany);
router.get("/getTAReport", getTAReport);

export default router;
