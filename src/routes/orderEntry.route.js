import { Router } from "express";
import {
  getOrderEntryCount,
  getOrderEntryStatus,
  getOrderEntryBuyerStatus,
  getOrderEntryBuyerQtyWise,
  getOrderEntryBuyerWisePoNoQty,
  getOrderEntryStyleWisePoNoQty,
  getOrderEntryColorWiseQty,
  getOrderEntryProfitLossdropdown,
  getOrderEntryProfitLossReport,
} from "../services/orderEntry.service.js";
import {
  getOrderEntryStatusTable,
  getfabricProcessPlanTable,
  getAccessoriesPlanTable,
  getCMTPlanTable,
  getPreBudjetTable,
  getOrderEntryBuyerWiseStatusTable,
  getOrderEntryBuyerWiseStatusStyleTopBottomTable,
  getOrderEntryBuyerPoNoWiseQtyStatusTable,
  getOrderEntryBuyerWiseQuantityTable,
  getOrderEntryStyleItemGroupWiseQtyTable,
  getOrderEntryColorWiseQtyTable,
  getOrderEntryStatusTableWithStatus,
} from "../services/orderEntryTable.service.js";

const router = Router();

router.get("/getOrderEntryCount", getOrderEntryCount);
router.get("/getOrderEntryStatus", getOrderEntryStatus);
router.get("/getOrderEntryBuyerStatus", getOrderEntryBuyerStatus);
router.get("/getOrderEntryBuyerWiseQty", getOrderEntryBuyerQtyWise);
router.get("/getOrderEntryBuyerWisePoNoQty", getOrderEntryBuyerWisePoNoQty);
router.get("/getOrderEntryStyleWiseQty", getOrderEntryStyleWisePoNoQty);
router.get("/getOrderEntryColorWiseQty", getOrderEntryColorWiseQty);
router.get("/getOrderEntryProfitLossOrderNo", getOrderEntryProfitLossdropdown);
router.get("/getOrderEntryProfitLossReport", getOrderEntryProfitLossReport);

// Table Services

router.get("/getOrderEntryStatusTable", getOrderEntryStatusTable);
router.get("/getfabricProcessPlanTable", getfabricProcessPlanTable);
router.get("/getAccessoriesPlanTable", getAccessoriesPlanTable);
router.get("/getCMTPlanTable", getCMTPlanTable);
router.get("/getPreBudjetTable", getPreBudjetTable);

router.get(
  "/getOrderEntryStatusTableWithStatus",
  getOrderEntryStatusTableWithStatus,
);

router.get(
  "/getOrderEntryBuyerWiseStatusTable",
  getOrderEntryBuyerWiseStatusTable,
);
router.get(
  "/getOrderEntryBuyerWiseStatusStyleTable",
  getOrderEntryBuyerWiseStatusStyleTopBottomTable,
);
router.get(
  "/getOrderEntryBuyerWiseQuantityTable",
  getOrderEntryBuyerWiseQuantityTable,
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

export default router;
