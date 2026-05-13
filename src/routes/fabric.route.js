import { Router } from "express";

const router = Router();

import {
  getFabricStatus,
  getFabricStatusTable,
  getFabricPending,
  getFabricPendingTable,
} from "../services/fabric.service.js";

router.get("/getFabricStatus", getFabricStatus);
router.get("/getFabricStatusTable", getFabricStatusTable);
router.get("/getFabricPending", getFabricPending);
router.get("/getFabricPendingTable", getFabricPendingTable);

export default router;
