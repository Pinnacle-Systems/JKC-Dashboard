import { Router } from "express";

import {
  getCombinedPurchase,
  getCombinedPurchaseOrderMonthWise,
  getGenaralPurchaseMonthWise,
  getPurchase,
  getCompany,
  getPurchaseOrder,
  getPurchaseOrderMonthWise,
  getPurchaseOrderYear,
  getPurchaseOrderMaterial,
  getTopTenSupplierOrder,
  getPurchaseGeneralYear,
  getPurchaseCombinedCOMPYear,
  getTopTenSupplierCombined,
  getTopTenSupplierGeneral,
  getPurchaseOrderQuarterWise,
  getPurchaseGeneralQuarterWise,
  getCombinedPurchaseQuarterWise,
  getPurchaseGeneralItemGroup,
  getTopSupplierListGreyYarn,
  getTopSupplierListDyedYarn,
  getTopSupplierListGreyFabric,
  getTopSupplierListDyedFabric,
  getTopSupplierListAccessory,
  getTopTenItemsCombined,
  getTopTenItemsOrder,
  getTopTenItemsGeneral,
  getToptenItemListGreyYarn,
  getToptenItemListDyedYarn,
  getToptenItemListGreyFabric,
  getToptenItemListDyedFabric,
  getToptenItemListAccessory,
  getSupplierDelayedOrder,
  getSupplierDelayedCombined,
  getSupplierDelayListGreyYarn,
  getSupplierDelayListDyedYarn,
  getSupplierListDelayGreyFabric,
  getSupplierListDelayDyedFabric,
  getSupplierListDelayAccessory,
  getSupplierDelayedgeneral,
  getSupplierEfficiencyOrder,
  getSupplierEfficiencyCombined,
  getSupplierEfficiencyGeneral,
  getSupplierEfficiencyListGreyYarn,
  getSupplierEfficiencyListDyedYarn,
  getSupplierListEfficiencyGreyFabric,
  getSupplierListEfficiencyAccessory,
  getSupplierListEfficiencyDyedFabric,
} from "../services/purchase.service.js";
import {
  getGeneralTable,
  getGreyYarnTable,
  getDyedYarnTable,
  getGreyFabricTable,
  getDyedFabricTable,
  getAccessoryTable,
  getGeneralSupplierToptenTable,
  getGreyYarnSupplierToptenTable,
  getDyedYarnSupplierToptenTable,
  getGreyFabricSupplierToptenTable,
  getDyedFabricSupplierToptenTable,
  getAccessorySupplierToptenTable,
  getQuarterGeneralTable,
  getGreyYarnQuarterTable,
  getDyedYarnQuarterTable,
  getGreyFabricQuarterTable,
  getDyedFabricQuarterTable,
  getAccessoryQuarterTable,
  getMonthGeneralTable,
  getMonthGreyYarnTable,
  getMonthDyedYarnTable,
  getMonthGreyFabricTable,
  getMonthDyedFabricTable,
  getAccessoryMonthTable,
  getItemBreakUp,
  getGeneralItemToptenTable,
  getGreyYarnItemToptenTable,
  getDyedYarnItemToptenTable,
  getGreyFabricItemToptenTable,
  getDyedFabricItemToptenTable,
  getAccessoryItemToptenTable,
  getGeneralSupplierDelayTable,
  getGreyYarnSupplierDelayTable,
  getDyedYarnSupplierDelayTable,
  getGreyFabricSupplierDelayTable,
  getDyedFabricSupplierDelayTable,
  getAccessorySupplierDelayTable,
  getGeneralSupplierNonDelayTable,
  getGreyYarnSupplierNonDelayTable,
  getDyedYarnSupplierNonDelayTable,
  getGreyFabricSupplierNonDelayTable,
  getDyedFabricSupplierNonDelayTable,
  getAccessorySupplierNonDelayTable,
} from "../services/purchaseTable.service.js";

const router = Router();

router.get("/getCompany", getCompany);

// router.get("/getPurchase", getPurchase);
// router.get("/getPurchaseOrder", getPurchaseOrder);

// front page
router.get("/getCombinedPurchaseOrder", getCombinedPurchase);

router.get("/getYearPurchaseOrder", getPurchaseOrderYear);
router.get("/getYearPurchaseGeneral", getPurchaseGeneralYear);
router.get("/getYearPurchaseCombinedCOMP", getPurchaseCombinedCOMPYear);

router.get("/getQuarterPurchaseOrder", getPurchaseOrderQuarterWise);
router.get("/getQuarterPurchaseGeneral", getPurchaseGeneralQuarterWise);
router.get("/getQuarterPurchaseCombinedCOMP", getCombinedPurchaseQuarterWise);

router.get("/getMonthPurchaseOrder", getPurchaseOrderMonthWise);
router.get("/getMonthGeneralPurchaseOrder", getGenaralPurchaseMonthWise);
router.get("/getMonthCombinedPurchaseOrder", getCombinedPurchaseOrderMonthWise);

router.get("/getTopTenSupplierOrder", getTopTenSupplierOrder);
router.get("/getTopTenSupplierGeneral", getTopTenSupplierGeneral);
router.get("/getTopTenSupplierCombined", getTopTenSupplierCombined);

router.get("/getTopTenItemsOrder", getTopTenItemsOrder);
router.get("/getTopTenItemsGeneral", getTopTenItemsGeneral);
router.get("/getTopTenItemsCombined", getTopTenItemsCombined);

router.get("/getMaterialWise", getPurchaseOrderMaterial);
router.get("/getItemGroupWise", getPurchaseGeneralItemGroup);

router.get("/getGeneralYear", getGeneralTable);

router.get("/getGreyYarnTable", getGreyYarnTable);
router.get("/getDyedYarnTable", getDyedYarnTable);
router.get("/getGreyFabricTable", getGreyFabricTable);
router.get("/getDyedFabricTable", getDyedFabricTable);
router.get("/getAccessoryTable", getAccessoryTable);

router.get("/getTopTenSupplierGeneralTable", getGeneralSupplierToptenTable);
router.get("/getTopTenSupplierGreyYarnTable", getGreyYarnSupplierToptenTable);
router.get("/getTopTenSupplierDyedYarnTable", getDyedYarnSupplierToptenTable);
router.get(
  "/getTopTenSupplierGreyFabricTable",
  getGreyFabricSupplierToptenTable,
);
router.get(
  "/getTopTenSupplierDyedFabricTable",
  getDyedFabricSupplierToptenTable,
);
router.get("/getTopTenSupplierAccessoryTable", getAccessorySupplierToptenTable);

router.get("/getTopTenItemGeneralTable", getGeneralItemToptenTable);
router.get("/getTopTenItemGreyYarnTable", getGreyYarnItemToptenTable);
router.get("/getTopTenItemDyedYarnTable", getDyedYarnItemToptenTable);
router.get("/getTopTenItemGreyFabricTable", getGreyFabricItemToptenTable);
router.get("/getTopTenItemDyedFabricTable", getDyedFabricItemToptenTable);
router.get("/getTopTenItemAccessoryTable", getAccessoryItemToptenTable);

router.get("/getTopTenSupplierListGreyYarnTable", getTopSupplierListGreyYarn);
router.get("/getTopTenSupplierListDyedYarnTable", getTopSupplierListDyedYarn);
router.get(
  "/getTopTenSupplierListGreyFabricTable",
  getTopSupplierListGreyFabric,
);
router.get(
  "/getTopTenSupplierListDyedFabricTable",
  getTopSupplierListDyedFabric,
);
router.get("/getTopTenSupplierListAccessoryTable", getTopSupplierListAccessory);

router.get("/getTopTenItemListGreyYarnTable", getToptenItemListGreyYarn);
router.get("/getTopTenItemListDyedYarnTable", getToptenItemListDyedYarn);
router.get("/getTopTenItemListGreyFabricTable", getToptenItemListGreyFabric);
router.get("/getTopTenItemListDyedFabricTable", getToptenItemListDyedFabric);
router.get("/getTopTenItemListAccessoryTable", getToptenItemListAccessory);

router.get("/getQuarterwiseGeneralTable", getQuarterGeneralTable);
router.get("/getQuarterwiseGreyYarnTable", getGreyYarnQuarterTable);
router.get("/getQuarterwiseDyedYarnTable", getDyedYarnQuarterTable);
router.get("/getQuarterwiseGreyFabricTable", getGreyFabricQuarterTable);
router.get("/getQuarterwiseDyedFabricTable", getDyedFabricQuarterTable);
router.get("/getQuarterwiseAccessoryTable", getAccessoryQuarterTable);

router.get("/getMonthwiseGeneralTable", getMonthGeneralTable);
router.get("/getMonthwiseGreyYarnTable", getMonthGreyYarnTable);
router.get("/getMonthwiseDyedYarnTable", getMonthDyedYarnTable);
router.get("/getMonthwiseGreyFabricTable", getMonthGreyFabricTable);
router.get("/getMonthwiseDyedFabricTable", getMonthDyedFabricTable);
router.get("/getMonthwiseAccessoryTable", getAccessoryMonthTable);

router.get("/getItemNameTable", getItemBreakUp);

router.get("/getSupplierDelayOrder", getSupplierDelayedOrder);
router.get("/getSupplierDelayCombined", getSupplierDelayedCombined);
router.get("/getSupplierDelayGeneral", getSupplierDelayedgeneral);

router.get("/getSupplierEfficiencyOrder", getSupplierEfficiencyOrder);
router.get("/getSupplierEfficiencyCombined", getSupplierEfficiencyCombined);
router.get("/getSupplierEfficiencyGeneral", getSupplierEfficiencyGeneral);

router.get(
  "/getSupplierDelayedGreyYarnListTable",
  getSupplierDelayListGreyYarn,
);
router.get(
  "/getSupplierDelayedDyedYarnListTable",
  getSupplierDelayListDyedYarn,
);
router.get(
  "/getSupplierDelayedGreyFabricListTable",
  getSupplierListDelayGreyFabric,
);
router.get(
  "/getSupplierDelayedDyedFabricListTable",
  getSupplierListDelayDyedFabric,
);
router.get(
  "/getSupplierDelayedAccessoryListTable",
  getSupplierListDelayAccessory,
);

router.get(
  "/getSupplierEfficiencyGreyYarnListTable",
  getSupplierEfficiencyListGreyYarn,
);
router.get(
  "/getSupplierEfficiencyDyedYarnListTable",
  getSupplierEfficiencyListDyedYarn,
);
router.get(
  "/getSupplierEfficiencyGreyFabricListTable",
  getSupplierListEfficiencyGreyFabric,
);
router.get(
  "/getSupplierEfficiencyDyedFabricListTable",
  getSupplierListEfficiencyAccessory,
);
router.get(
  "/getSupplierEfficiencyAccessoryListTable",
  getSupplierListEfficiencyDyedFabric,
);

router.get("/getSupplierDelayedgeneralTable", getGeneralSupplierDelayTable);
router.get("/getSupplierDelayedGreyYarnTable", getGreyYarnSupplierDelayTable);
router.get("/getSupplierDelayedDyedYarnTable", getDyedYarnSupplierDelayTable);
router.get(
  "/getSupplierDelayedGreyFabricTable",
  getGreyFabricSupplierDelayTable,
);
router.get(
  "/getSupplierDelayedDyedFabricTable",
  getDyedFabricSupplierDelayTable,
);
router.get("/getSupplierDelayedAccessoryTable", getAccessorySupplierDelayTable);

router.get(
  "/getSupplierEfficiencyGeneralTable",
  getGeneralSupplierNonDelayTable,
);
router.get(
  "/getSupplierEfficiencyGreyYarnTable",
  getGreyYarnSupplierNonDelayTable,
);
router.get(
  "/getSupplierEfficiencyDyedYarnTable",
  getDyedYarnSupplierNonDelayTable,
);
router.get(
  "/getSupplierEfficiencyGreyFabricTable",
  getGreyFabricSupplierNonDelayTable,
);
router.get(
  "/getSupplierEfficiencyDyedFabricTable",
  getDyedFabricSupplierNonDelayTable,
);
router.get(
  "/getSupplierEfficiencyAccessoryTable",
  getAccessorySupplierNonDelayTable,
);

export default router;
