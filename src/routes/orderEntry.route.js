import { Router } from "express";
import {
  getOrderEntryCount,
  getOrderEntryStatus,
  getOrderEntryBuyerStatus,
  getOrderEntryBuyerQtyWise,
  getOrderEntryBuyerWisePoNoQty,
} from "../services/orderEntry.service.js";
import {
  getOrderEntryStatusTable,
  getfabricProcessPlanTable,
  getAccessoriesPlanTable,
  getCMTPlanTable,
  getPreBudjetTable,
  getOrderEntryBuyerWiseStatusTable,
  getOrderEntryBuyerPoNoWiseQtyStatusTable,
} from "../services/orderEntryTable.service.js";

const router = Router();

router.get("/getOrderEntryCount", getOrderEntryCount);
router.get("/getOrderEntryStatus", getOrderEntryStatus);
router.get("/getOrderEntryBuyerStatus", getOrderEntryBuyerStatus);
router.get("/getOrderEntryBuyerWiseQty", getOrderEntryBuyerQtyWise);
router.get("/getOrderEntryBuyerWisePoNoQty", getOrderEntryBuyerWisePoNoQty);

// Table Services

router.get("/getOrderEntryStatusTable", getOrderEntryStatusTable);
router.get("/getfabricProcessPlanTable", getfabricProcessPlanTable);
router.get("/getAccessoriesPlanTable", getAccessoriesPlanTable);
router.get("/getCMTPlanTable", getCMTPlanTable);
router.get("/getPreBudjetTable", getPreBudjetTable);
router.get(
  "/getOrderEntryBuyerWiseStatusTable",
  getOrderEntryBuyerWiseStatusTable,
);
router.get(
  "/getOrderEntryBuyerPoNoWiseStatusTable",
  getOrderEntryBuyerPoNoWiseQtyStatusTable,
);

export default router;
