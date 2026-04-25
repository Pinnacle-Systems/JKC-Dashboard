import { Router } from "express";
import {
  getOrderEntryCount,
  getOrderEntryStatus,
  getOrderEntryBuyerStatus,
} from "../services/orderEntry.service.js";
import { getOrderEntryStatusTable } from "../services/orderEntryTable.service.js";

const router = Router();

router.get("/getOrderEntryCount", getOrderEntryCount);
router.get("/getOrderEntryStatus", getOrderEntryStatus);
router.get("/getOrderEntryBuyerStatus", getOrderEntryBuyerStatus);

// Table Services

router.get("/getOrderEntryStatusTable", getOrderEntryStatusTable);

export default router;
