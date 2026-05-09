import { Router } from "express";

import { getProduction } from "../services/production.service.js";

const router = Router();

router.get("/getProduction", getProduction);

export default router;
