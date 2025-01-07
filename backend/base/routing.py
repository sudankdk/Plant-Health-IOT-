from django.urls import path
from .consumers import Sensordataconsumers,HydrationDataConsumer,PushNotificationConsumer

websocket_urlpatterns = [
    path('ws/sensors/', Sensordataconsumers.as_asgi()),
    path('ws/sensors/hydrataion/', HydrationDataConsumer.as_asgi()),
    path('ws/sensors/notification/', PushNotificationConsumer.as_asgi()),
]
