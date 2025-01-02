from django.db import models

class SensorData(models.Model):
    temperature=models.FloatField()
    humidity=models.FloatField()
    soilmoisture=models.IntegerField()
    timestamp=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp}: Temp={self.temperature}, Hum={self.humidity}, Soil={self.soilmoisture}"