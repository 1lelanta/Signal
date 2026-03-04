import Post from "../models/Post.model.js";

export const getFeed = async(req, res)=>{
    try {
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPaginationQuery) {
            const posts = await Post.find({isPublished:true})
            .sort({depthScore:-1})
            .populate("author", "username reputationScore avatar");

            return res.json(posts);
        }

        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Post.find({ isPublished: true })
                .sort({ depthScore: -1 })
                .skip(skip)
                .limit(limit)
                .populate("author", "username reputationScore avatar"),
            Post.countDocuments({ isPublished: true }),
        ]);

        return res.json({
            items,
            page,
            limit,
            total,
            hasMore: skip + items.length < total,
        });

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}