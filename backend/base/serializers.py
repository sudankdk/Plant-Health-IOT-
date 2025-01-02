from rest_framework import serializers
from .models import SensorData

class sensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['temperature', 'humidity', 'soilmoisture', 'timestamp']
