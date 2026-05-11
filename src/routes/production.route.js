import { Router } from "express";

import { getProduction } from "../services/production.service.js";
import { getProductionTable } from "../services/productionTable.service.js";

const router = Router();

router.get("/getProduction", getProduction);
router.get("/getProductionTable", getProductionTable);

export default router;
