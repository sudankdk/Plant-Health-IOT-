import React, { useEffect } from 'react';
import Push from 'push.js';

interface NotificationData {
  message: string;
}

const NotificationComponent: React.FC = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/sensors/notification/');

    ws.onmessage = (event) => {
      const data: NotificationData = JSON.parse(event.data);
      Push.create('Plant Alert', {
        body: data.message,
        timeout: 5000,
        onClick: () => window.focus(),
      });
    };

    return () => ws.close();
  }, []);

  return null;
};

export default NotificationComponent;