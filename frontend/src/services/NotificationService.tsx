import React, { useEffect } from 'react';
import Push from 'push.js';

interface NotificationData {
  temperature: number;
  humidity: number;
  soilmoisture: number;
  timestamp: string;
}

const NotificationComponent: React.FC = () => {
  useEffect(() => {
    const ws = new WebSocket('wss://plant-health-iot-1.onrender.com:443/ws/sensors/');

    ws.onmessage = (event) => {
      try {
        const data: NotificationData = JSON.parse(event.data);

        // Check if soil moisture is below threshold
        if (data.soilmoisture < 40) {
          Push.create('Plant Alert', {
            body: `Soil moisture is low (${data.soilmoisture}%). Please water the plant.`,
            timeout: 5000,
            onClick: () => window.focus(),
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => ws.close(); // Clean up WebSocket connection on unmount
  }, []);

  return null;
};

export default NotificationComponent;
