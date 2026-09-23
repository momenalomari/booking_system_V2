import express from "express";
import {
  getPendingManagers,
  reviewManagerRequest,

} from "../controller/admin.controller.js";

const router = express.Router();

router.get("/field-managers/pending", getPendingManagers);
router.patch("/field-managers/:id/review", reviewManagerRequest);

export default router;
