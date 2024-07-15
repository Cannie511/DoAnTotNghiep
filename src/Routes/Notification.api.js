const express = require("express");
const router = express.Router();
const NotificationController = require("../Controllers/Notification.Controller");

router.post("/notification/create", async (req, res) => {
  const notification = new NotificationController(req, res);
  return notification.create();
});

router.put("/notification/update", async (req, res)=>{
  const notification = new NotificationController(req, res);
  return notification.update();
});

router.post("/notification/getAll", async (req, res) => {
  const notification = new NotificationController(req, res);
  return notification.getAll();
});

router.post("/notification/getRequest", async (req, res) => {
  const notification = new NotificationController(req, res);
  return notification.getRequest();
});

router.post("/notification/countAll", async (req, res) => {
  const notification = new NotificationController(req, res);
  return notification.countAll();
});

module.exports = router;
