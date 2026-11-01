import { Router } from "express";
import UserController from "./controllers/userController.js";
import ParkirController from "./controllers/parkirController.js";
import authenticate from "./middleware/authenticate.js";

const router = Router();

router.post("/users", UserController.store);
router.get("/users", UserController.get);
router.get("/users/:id", UserController.detail);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);
router.post("/users/login", UserController.login);
router.post("/users/register", UserController.register);
router.get("/me", authenticate, UserController.me);

router.post("/parkir",authenticate, ParkirController.order);
router.get("/parkir",authenticate, ParkirController.get);
router.put("/parkir/:id",authenticate, ParkirController.update);
router.delete("/parkir/:id", authenticate, ParkirController.cancel);

export default router;