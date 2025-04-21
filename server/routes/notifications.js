import { Router } from "express";  // create an instance of an express router
import Notification from "../functions/notification_functions.js";

const router = Router();  // groups together requests

router.post('/send/comment/notification', async(req, res) =>{
  const {content_id, username} = req.body;

  if(!content_id || !username) return res.status(400).json({ error: "Missing value" });

  const notification_id = await Notification.createCommentNotif(content_id, username);
  if(!notification_id) return res.status(406).json({ errror: "Unable to create notification_id"});
  res.status(201).json({ notification_id : notification_id })
})

router.post('/send/vote/notification', async(req, res) =>{
  const {content_id, user_id} = req.body;

  if(!content_id || !user_id) return res.status(400).json({ error: "Missing value" });
  const notification_id = await Notification.createVoteNotif(content_id, user_id);
  console.log(notification_id);
  if(!notification_id) return res.status(406).json({ errror: "Unable to create notification_id"});
  res.status(201).json({ notification_id : notification_id })
})

router.post('/send/matching/notification', async(req, res) =>{
  const {content_id, email} = req.body;

  if(!content_id || !email) return res.status(400).json({ error: "Missing value" });

  const notification_id = await Notification.createMatchingNotif(content_id, email);
  if(!notification_id) return res.status(406).json({ errror: "Unable to create notification_id"});
  res.status(201).json({ notification_id : notification_id })
})

router.post('/mark/notifcations/read', async(req, res) =>{ 
  const {user_id} = req.body;

  if(!user_id) return res.status(400).json({ error: "Missing user_id" });

  await Notification.markRead(user_id);
  res.status(201).json({ msg: "successfully marked notifications as read"})
})

router.delete('/remove/notification/:id/:type', async(req, res) =>{ 
  const { id, type } = req.params;

  if(!id || !type) return res.status(400).json( { error: "Missing notification_id" });

  await Notification.removeNotif(id, type);
  res.status(201).json({ msg: "successfully removed notification"})
})

router.get('/get/notifications/:id', async(req, res) => { 
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });
  const notifications = await Notification.getUserNotifs(id);
  res.status(200).json({ notifications:notifications })
})

router.post('/get/notification/content', async (req, res) => { 
  const { notifications } = req.body;

  try {
    const contents = await Notification.getNotificationContent(notifications);
    res.status(200).json({ notifications: contents });
  } catch (error) {
    console.error("Error in route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/unread/notifications/:id', async (req, res) => { 
  const { id } = req.params;

  const unread = await Notification.unreadNotifications(id); // returns true if there are unread notifications, false otherwise
  res.status(200).json({ unread:unread });
});

export default router;