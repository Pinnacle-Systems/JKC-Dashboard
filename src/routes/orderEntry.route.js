import { Router } from "express";
import {
  getOrderEntryCount,
  getOrderEntryStatus,
  getOrderEntryBuyerStatus,
  getOrderEntryBuyerQtyWise,
  getOrderEntryBuyerWisePoNoQty,
  getOrderEntryStyleWisePoNoQty,
  getOrderEntryColorWiseQty,
} from "../services/orderEntry.service.js";
import {
  getOrderEntryStatusTable,
  getfabricProcessPlanTable,
  getAccessoriesPlanTable,
  getCMTPlanTable,
  getPreBudjetTable,
  getOrderEntryBuyerWiseStatusTable,
  getOrderEntryBuyerPoNoWiseQtyStatusTable,
  getOrderEntryStyleItemGroupWiseQtyTable,
  getOrderEntryColorWiseQtyTable,getOrderEntryStatusTableWithStatus
} from "../services/orderEntryTable.service.js";

const router = Router();

router.get("/getOrderEntryCount", getOrderEntryCount);
router.get("/getOrderEntryStatus", getOrderEntryStatus);
router.get("/getOrderEntryBuyerStatus", getOrderEntryBuyerStatus);
router.get("/getOrderEntryBuyerWiseQty", getOrderEntryBuyerQtyWise);
router.get("/getOrderEntryBuyerWisePoNoQty", getOrderEntryBuyerWisePoNoQty);
router.get("/getOrderEntryStyleWiseQty", getOrderEntryStyleWisePoNoQty);
router.get("/getOrderEntryColorWiseQty", getOrderEntryColorWiseQty);

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
router.get(
  "/getOrderEntryStyleWiseTable",
  getOrderEntryStyleItemGroupWiseQtyTable,
);
router.get("/getOrderEntryColorWiseTable", getOrderEntryColorWiseQtyTable);
router.get("/getOrderEntryStatusTableWithStatus", getOrderEntryStatusTableWithStatus);

export default router;
