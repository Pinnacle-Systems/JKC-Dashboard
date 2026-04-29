import { Router } from "express";
import {
  getOrderEntryCount,
  getOrderEntryStatus,
  getOrderEntryBuyerStatus,
} from "../services/orderEntry.service.js";
import { getOrderEntryStatusTable,getfabricProcessPlanTable,getAccessoriesPlanTable,getCMTPlanTable,getPreBudjetTable } from "../services/orderEntryTable.service.js";

const router = Router();

router.get("/getOrderEntryCount", getOrderEntryCount);
router.get("/getOrderEntryStatus", getOrderEntryStatus);
router.get("/getOrderEntryBuyerStatus", getOrderEntryBuyerStatus);

// Table Services

router.get("/getOrderEntryStatusTable", getOrderEntryStatusTable);
router.get("/getfabricProcessPlanTable", getfabricProcessPlanTable);
router.get("/getAccessoriesPlanTable", getAccessoriesPlanTable);
router.get("/getCMTPlanTable", getCMTPlanTable);
router.get("/getPreBudjetTable", getPreBudjetTable);

export default router;
