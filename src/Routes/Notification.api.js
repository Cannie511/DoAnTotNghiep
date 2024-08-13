const express = require("express");
const router = express.Router();
const NotificationController = require("../Controllers/Notification.Controller");

router.post("/notification/create", async (req, res) => {
  const notification = new NotificationController(req, res);
  return await notification.create();
});

router.put("/notification/update", async (req, res)=>{
  const notification = new NotificationController(req, res);
  return await notification.update();
});

router.post("/notification/getAll", async (req, res) => {
  const notification = new NotificationController(req, res);
  return await notification.getAll();
});

router.post("/notification/getRequest", async (req, res) => {
  const notification = new NotificationController(req, res);
  return await notification.getRequest();
});

router.post("/notification/countAll", async (req, res) => {
  const notification = new NotificationController(req, res);
  return await notification.countAll();
});

router.post("/notification/delete/:notification_id", async (req, res) => {
  const notification = new NotificationController(req, res);
  return await notification.delete();
});

module.exports = router;
