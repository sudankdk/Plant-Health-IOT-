import { useEffect } from "react";
import Push from "push.js";

const NotificationComponent = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/sensors/notification/");

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (Push.Permission === "granted") {
        Push.create("Plant Alert", {
          body: data.message,
          timeout: 5000, // Notification will close after 5 seconds
          onClick: () => window.focus(), // Focus on the window when clicked
        });
      }
    };

    return () => ws.close();
  }, []);

  return null;
};

export default NotificationComponent;
