import express from 'express'   
import NotificationHandler from '../Handler/NotifactionHandler.mjs'

const notificationRoute = express.Router()


notificationRoute.post("/send_notification",NotificationHandler.sendNotifcationn)

notificationRoute.post("/add_notification",NotificationHandler.addNotification)

notificationRoute.get("/get_notification",NotificationHandler.getNotifications)


notificationRoute.get("/fetch_notification/:id",NotificationHandler.fetchNotification)

notificationRoute.put("/update_notification/:nID",NotificationHandler.updateNotification)

export default notificationRoute