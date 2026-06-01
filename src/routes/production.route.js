import { Router } from "express";

import {
  getProduction,
  getProductionEfficiency,
  getProductionEfficiencyEmployee,
  getProductionEff,
} from "../services/production.service.js";
import {
  getProductionTable,
  getProductionSummaryTable,
  getProductionEfficiencyTable,
  getProductionEfficiencyEmployeeTable,
  getProductionEfficiencyEffTable,
} from "../services/productionTable.service.js";

const router = Router();

router.get("/getProduction", getProduction);
router.get("/getProductionTable", getProductionTable);
router.get("/getProductionSummaryTable", getProductionSummaryTable);
router.get("/getProductionEfficiency", getProductionEfficiency);
router.get("/getProductionEfficiencyTable", getProductionEfficiencyTable);
router.get("/getProductionEfficiencyManpower", getProductionEfficiencyEmployee);
router.get("/getProductionEff", getProductionEff);

router.get(
  "/getProductionEfficiencyManpowertable",
  getProductionEfficiencyEmployeeTable,
);
router.get("/getProductionEfftable", getProductionEfficiencyEffTable);

export default router;
