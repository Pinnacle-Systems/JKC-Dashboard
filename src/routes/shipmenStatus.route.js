import { Router } from "express";
import {
  getShipmentCount,
  getShipmentBuyerList,
  getShipmentBuyerReport,
} from "../services/shipmentStatus.service.js";

const router = Router();

router.get("/getOrderEntryShipmentCount", getShipmentCount);
router.get("/getOrderEntryShipmentBuyerList", getShipmentBuyerList);
router.get("/getOrderEntryShipmentReport", getShipmentBuyerReport);

export default router;
