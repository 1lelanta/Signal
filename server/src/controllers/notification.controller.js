import Notification from "../models/Notification.model.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("actor", "username avatar")
      .limit(100);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    return res.json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};