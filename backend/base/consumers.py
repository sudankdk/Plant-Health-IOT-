import json
from channels.generic.websocket import AsyncWebsocketConsumer

class Sensordataconsumers(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("sensor_data",self.channel_name) 
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sensor_data", self.channel_name)
        
    async def send_sensor_data(self,event):
        data=event['data']
        await self.send(text_data=json.dumps(data))


class HydrationDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("Hydratation_data",self.channel_name)
        await self.accept()
        
    async def disconnect(self,close_code):
        await self.channel_layer.group_discard("Hydratation_data",self.channel_name)
            
    async def send_hydration_data(self,event):
        data=event['data']
        await self.send(text_data=json.dumps(data))

class PushNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("Notification_data",self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard("Notification_data",self.channel_name)
        
    async def send_notification(self,event):
        data=event['data']
        await self.send(text_data=json.dumps({'message':data}))
        
