import { Router } from "express";
import { getLatestPurchase, getLoadPurchaseData, getMonthWisePurchase, getPendingInward, getPendingInwardSupplierDetails, getRejectedPOS, getRejectedPOSBySupplier, getSupplierByName, getSupplierList, getSupplierPOS, getSupplierPOSMonth } from "../services/purchaseOrder.service.js";
const router = Router();

router.get("/purLoadData", getLoadPurchaseData);
router.get("/supplierPOs", getSupplierPOS);
router.get("/supplierPOSMonth", getSupplierPOSMonth);
router.get("/getSupplierDetails",getSupplierByName)
router.get("/getSuppliers", getSupplierList);
router.get("/rejectedPOs", getRejectedPOS);
router.get("/rejectedPOsBySupplier", getRejectedPOSBySupplier);
router.get("/getLatestPurchaseData", getLatestPurchase);
router.get("/getPendingInward",getPendingInward);
router.get("/getPendingInwardDetails",getPendingInwardSupplierDetails);
router.get("/monthwisePO",getMonthWisePurchase)

export default router;