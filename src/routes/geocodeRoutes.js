import { Router } from "express";
import { reverseGeocode, searchAddress } from "../controllers/geocodeController.js";

const router = Router();

router.get("/reverse", reverseGeocode);
router.get("/search", searchAddress);

export default router;
