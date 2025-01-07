from django.urls import path
from .views import SensorDataView

urlpatterns = [
    path('sensors/', SensorDataView.as_view(), name='sensor-data'),
    # path('notification/', notification_push, name='notification-data'),
]
