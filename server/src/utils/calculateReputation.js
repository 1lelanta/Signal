import Reputation from "../models/Reputation.model.js";

export const calculateReputation = async (userId) => {
	const [summary] = await Reputation.aggregate([
		{ $match: { user: userId } },
		{
			$group: {
				_id: "$user",
				total: { $sum: "$points" },
				count: { $sum: 1 },
				postPoints: {
					$sum: {
						$cond: [{ $eq: ["$sourceType", "post"] }, "$points", 0],
					},
				},
				commentPoints: {
					$sum: {
						$cond: [{ $eq: ["$sourceType", "comment"] }, "$points", 0],
					},
				},
				tagPoints: {
					$sum: {
						$cond: [{ $eq: ["$sourceType", "tag"] }, "$points", 0],
					},
				},
				moderationPoints: {
					$sum: {
						$cond: [{ $eq: ["$sourceType", "moderation"] }, "$points", 0],
					},
				},
			},
		},
	]);

	if (!summary) {
		return {
			score: 0,
			eventsCount: 0,
			breakdown: {
				post: 0,
				comment: 0,
				tag: 0,
				moderation: 0,
			},
		};
	}

	return {
		score: summary.total || 0,
		eventsCount: summary.count || 0,
		breakdown: {
			post: summary.postPoints || 0,
			comment: summary.commentPoints || 0,
			tag: summary.tagPoints || 0,
			moderation: summary.moderationPoints || 0,
		},
	};
};
