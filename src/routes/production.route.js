import { Router } from "express";

import { getProduction } from "../services/production.service.js";
import { getProductionTable,getProductionSummaryTable } from "../services/productionTable.service.js";

const router = Router();

router.get("/getProduction", getProduction);
router.get("/getProductionTable", getProductionTable);
router.get("/getProductionSummaryTable", getProductionSummaryTable);

export default router;
