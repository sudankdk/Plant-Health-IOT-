from django.urls import path
from .views import SensorDataView,hydrate

urlpatterns = [
    path('sensors/', SensorDataView.as_view(), name='sensor-data'),
    path('hydrate/', hydrate, name='hydrate-plant'),
    # path('notification/', notification_push, name='notification-data'),
]
