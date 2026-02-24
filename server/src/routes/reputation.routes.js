import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { updateReputation, getReputation } from "../controllers/reputation.controller.js";

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

// public: get user's reputation score
router.get("/:userId", async (req, res) => {
    try {
        const data = await getReputation(req.params.userId);
        return res.json({ success: true, score: data.score });
    } catch (err) {
        return res.status(404).json({ success: false, message: err.message || 'Not found' });
    }
});

export default router;