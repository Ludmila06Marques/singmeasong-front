import { Router } from "express";
import testsController from "../controllers/testsController.js";

const testRouter = Router();

testRouter.post("/reset", testsController.reset);

export default testRouter;