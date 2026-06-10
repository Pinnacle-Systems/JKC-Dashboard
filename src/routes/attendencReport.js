import { Router } from "express";

const router = Router();

import {
  getAttendenceCount,
  getAttendenceDistributionTable,
  getAttendenceDesignationWiseCount,
  getAttendenceDesignationTable,
  getDesignation,
} from "../services/attendence.service.js";

router.get("/getAttendenceCount", getAttendenceCount);
router.get("/getAttendenceTable", getAttendenceDistributionTable);
router.get("/getAttendenceDesignationCount", getAttendenceDesignationWiseCount);
router.get("/getAttendenceDesignationTable", getAttendenceDesignationTable);
router.get("/getDesignation", getDesignation);

export default router;
