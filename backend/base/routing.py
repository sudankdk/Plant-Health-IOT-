from django.urls import path
from .consumers import Sensordataconsumers

websocket_urlpatterns = [
    path('ws/sensors/', Sensordataconsumers.as_asgi()),
]
