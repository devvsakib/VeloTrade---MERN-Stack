import Notification from "../models/Notification.js";

/**
 * Send notification to a user
 */
export const sendNotification = async ({ userId, title, message, type }) => {
  const notification = await Notification.create({ userId, title, message, type });
  // TODO: Add email / push integration here
  console.log(`Notification sent to ${userId}: ${title}`);
  return notification;
};
