import { useState, useEffect, useCallback } from "react";
import api from "../../services/axios";

export function usePosts(userId = null) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const PAGE_SIZE = 10;

	const fetchPosts = useCallback(async (targetPage = 1, append = false) => {
		setLoading(true);
		try {
			if (userId) {
				const res = await api.get("/feed");
				let data = res.data || [];
				data = data.filter((p) => p.author?._id === userId || p.author === userId);
				setPosts(data);
				setHasMore(false);
				setPage(1);
				return;
			}

			const res = await api.get(`/feed?page=${targetPage}&limit=${PAGE_SIZE}`);
			const payload = res.data || {};
			const items = Array.isArray(payload.items) ? payload.items : [];

			if (append) {
				setPosts((prev) => [...prev, ...items]);
			} else {
				setPosts(items);
			}

			setHasMore(!!payload.hasMore);
			setPage(targetPage);
		} catch (err) {
			console.error("usePosts: failed to load posts", err);
			setPosts([]);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const loadMore = useCallback(async () => {
		if (!hasMore || loadingMore || userId) return;
		try {
			setLoadingMore(true);
			await fetchPosts(page + 1, true);
		} finally {
			setLoadingMore(false);
		}
	}, [fetchPosts, hasMore, loadingMore, page, userId]);

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

	return { posts, loading, loadingMore, hasMore, loadMore, getPostById, createPost, reload: fetchPosts };
}

