import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
    "/:userId",
    protect,
    authorizeRoles("moderator"),
    async(req, res)=>{
        const {points,reason, sourceType,sourceId} = req.body;

        await updateReputation(
            req.params.userId,
            points,
            reason,
            sourceType,
            sourceId
        );

        res.json({message: "Reputation updated"});
    }
);

export default router;