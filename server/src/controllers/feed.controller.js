import Post from "../models/Post.model.js";

export const getFeed = async(req, res)=>{
    try {
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;
        const rawQuery = String(req.query.q || "").trim();
        const searchRegex = rawQuery ? new RegExp(rawQuery, "i") : null;
        const filter = {
            isPublished: true,
            ...(searchRegex
                ? {
                      $or: [
                          { title: searchRegex },
                          { content: searchRegex },
                          { tags: searchRegex },
                      ],
                  }
                : {}),
        };

        if (!hasPaginationQuery) {
            const posts = await Post.find(filter)
            .sort({depthScore:-1})
            .populate("author", "username reputationScore avatar");

            return res.json(posts);
        }

        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Post.find(filter)
                .sort({ depthScore: -1 })
                .skip(skip)
                .limit(limit)
                .populate("author", "username reputationScore avatar"),
            Post.countDocuments(filter),
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