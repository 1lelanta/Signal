import { useState, useEffect, useCallback } from "react";
import api from "../../services/axios";

export function usePosts(userId = null) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const res = await api.get("/feed");
			let data = res.data || [];
			if (userId) {
				data = data.filter((p) => p.author?._id === userId || p.author === userId);
			}
			setPosts(data);
		} catch (err) {
			console.error("usePosts: failed to load posts", err);
			setPosts([]);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const createPost = useCallback(async ({ title, content, tags = [], imageFile = null }) => {
		const safeContent = (content || "").trim();
		if (!safeContent && !imageFile) {
			throw new Error("Post content or image is required");
		}

		const safeTitle = (title || safeContent.slice(0, 80) || "Image post").trim();
		let imageUrl = null;

		if (imageFile) {
			const formData = new FormData();
			formData.append("image", imageFile);
			const uploadRes = await api.post("/posts/upload-image", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			imageUrl = uploadRes.data?.imageUrl || null;
		}

		const payload = {
			title: safeTitle,
			content: safeContent,
			tags,
			imageUrl,
		};

		const res = await api.post("/posts", payload);
		setPosts((prev) => [res.data, ...prev]);
		return res.data;
	}, []);

	const getPostById = useCallback(
		(id) => {
			const found = posts.find((p) => p._id === id || p.id === id);
			if (found) return found;
			// fallback: fetch single post from API
			let mounted = true;
			(async () => {
				try {
					const res = await api.get(`/posts/${id}`);
					if (mounted) {
						// optionally cache it
						setPosts((prev) => (prev.some((p) => p._id === res.data._id) ? prev : [res.data, ...prev]));
					}
				} catch (err) {
					console.error("usePosts: failed to fetch single post", err);
				}
			})();
			return null;
		},
		[posts]
	);

	return { posts, loading, getPostById, createPost, reload: fetchPosts };
}

