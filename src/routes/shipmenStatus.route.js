import { Router } from "express";
import { getShipmentCount } from "../services/shipmentStatus.service.js";

const router = Router();

router.get("/getOrderEntryShipmentCount", getShipmentCount);

export default router;
