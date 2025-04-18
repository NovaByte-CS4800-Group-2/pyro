import { Router } from "express";  // create an instance of an express router
import Notification from "../functions/notification_functions.js";

const router = Router();  // groups together requests

router.post('/send/notification', async(req, res) =>{
  const {content_id, type, username} = req.body;

  if(!content_id || !type) return res.status(400).json({ error: "Missing value" });

  const notification_id = await Notification.createNotif(content_id, type, username);
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

router.get('/is/same/user/:username/:user_id', async (req, res) => { 
  const { username, user_id } = req.params;

    const sameUser = await Notification.sameUser(user_id, username);
    res.status(200).json({ sameUser:sameUser });

});


export default router;