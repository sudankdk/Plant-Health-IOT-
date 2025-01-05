from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import sensorDataSerializer
from .models import SensorData
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import JsonResponse


class SensorDataView(APIView):
    def post(self, request):
        data = request.data

       

        serializer = sensorDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            # Send data to WebSocket group
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "sensor_data",  
                {
                    "type": "send_sensor_data",
                    "data": serializer.data
                }
            )
            return Response({"message": "Data received successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Fetch the latest 10 sensor data records
        data = SensorData.objects.all().order_by('-timestamp')[:10]
        serializer = sensorDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


