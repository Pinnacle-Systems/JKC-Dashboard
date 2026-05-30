import { Router } from "express";

import {
  getProduction,
  getProductionEfficiency,
} from "../services/production.service.js";
import {
  getProductionTable,
  getProductionSummaryTable,
  getProductionEfficiencyTable,
} from "../services/productionTable.service.js";

const router = Router();

router.get("/getProduction", getProduction);
router.get("/getProductionTable", getProductionTable);
router.get("/getProductionSummaryTable", getProductionSummaryTable);
router.get("/getProductionEfficiency", getProductionEfficiency);
router.get("/getProductionEfficiencyTable", getProductionEfficiencyTable);

export default router;
