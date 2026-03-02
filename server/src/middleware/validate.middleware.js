export const validatePostInput = (req, res, next) => {
  const { content, imageUrl } = req.body;

  const safeContent = String(content || "").trim();
  const safeImageUrl = String(imageUrl || "").trim();

  if (!safeContent && !safeImageUrl) {
    return res.status(400).json({
      message: "Post content or image is required",
    });
  }

  next();
};
