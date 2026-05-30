import { Router } from "express";

const router = Router();

import {
  getFabricStatus,
  getFabricStatusTable,
  getFabricPending,
  getFabricPendingTable,
  getFabricDetails,
} from "../services/fabric.service.js";

router.get("/getFabricStatus", getFabricStatus);
router.get("/getFabricStatusTable", getFabricStatusTable);
router.get("/getFabricPending", getFabricPending);
router.get("/getFabricPendingTable", getFabricPendingTable);
router.get("/getFabricDetails", getFabricDetails);

export default router;
