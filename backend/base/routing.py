from django.urls import path
from .consumers import Sensordataconsumers,HydrationDataConsumer

websocket_urlpatterns = [
    path('ws/sensors/dht/', Sensordataconsumers.as_asgi()),
    path('ws/sensors/hydrataion/', HydrationDataConsumer.as_asgi()),
]
