from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import sensorDataSerializer
from .models import SensorData
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import JsonResponse
from rest_framework.decorators import api_view
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist


class ApiError:
    def __init__(self, code: str, message: str, details: dict = None):
        self.response = {
            "error": {
                "code": code,
                "message": message,
                "timestamp": datetime.now().isoformat(),
                "details": details or {}
            }
        }


class SensorDataView(APIView):
    def post(self, request):
        data = request.data

        # Deserialize the sensor data
        serializer = sensorDataSerializer(data=data)
        if serializer.is_valid():
            # Save the data to the database
            sensor_data = serializer.save()

            # Send data to WebSocket group
            channel_layer = get_channel_layer()

            # Send sensor data to the WebSocket group
            async_to_sync(channel_layer.group_send)(
                "sensor_data",  
                {
                    "type": "send_sensor_data",
                    "data": sensor_data.data
                }
            )

            # Check if moisture level is low and send notification if needed
            if sensor_data.soil_moisture <= 30:
                message = "Please water your plant"
                try:
                    # Send notification to the WebSocket group
                    async_to_sync(channel_layer.group_send)(
                        "Notification_data",  # Group name
                        {
                            "type": "send_notification",  # Message type for the consumer
                            "data": message
                        }
                    )
                except ConnectionError:
                    error = ApiError(
                        "CHANNEL_CONNECTION_ERROR",
                        "Failed to connect to notification service",
                        {"service": "channels", "group": "Notification_data"}
                    )
                    return Response(error.response, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                except Exception as e:
                    error = ApiError(
                        "NOTIFICATION_SEND_ERROR",
                        "Failed to send notification",
                        {"error_type": type(e).__name__, "error_details": str(e)}
                    )
                    return Response(error.response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Return success response
            return Response({
                "message": "Data received successfully",
                "notification_sent": sensor_data.soil_moisture <= 30,
                "data": {
                    "moisture_level": sensor_data.soil_moisture,
                    "timestamp": sensor_data.timestamp.isoformat()
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Fetch the latest 10 sensor data records
        data = SensorData.objects.all().order_by('-timestamp')[:10]
        serializer = sensorDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def notification_push(request):
#     try:
#         sensor_data = SensorData.objects.latest('timestamp')
        
#         if sensor_data.soil_moisture <= 30:
#             message = "Please water your plant"
#             channel_layer = get_channel_layer()
            
#             try:
#                 async_to_sync(channel_layer.group_send)(
#                     "Notification_data",
#                     {
#                         "type": "send_notification",
#                         "data": message
#                     }
#                 )
#             except ConnectionError:
#                 error = ApiError(
#                     "CHANNEL_CONNECTION_ERROR",
#                     "Failed to connect to notification service",
#                     {"service": "channels", "group": "Notification_data"}
#                 )
#                 return Response(error.response, status=status.HTTP_503_SERVICE_UNAVAILABLE)
#             except Exception as e:
#                 error = ApiError(
#                     "NOTIFICATION_SEND_ERROR",
#                     "Failed to send notification",
#                     {"error_type": type(e).__name__, "error_details": str(e)}
#                 )
#                 return Response(error.response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             return Response({
#                 "success": True,
#                 "message": "Low hydration notification sent",
#                 "data": {
#                     "moisture_level": sensor_data.soil_moisture,
#                     "timestamp": sensor_data.timestamp.isoformat(),
#                     "notification_sent": True
#                 }
#             }, status=status.HTTP_202_ACCEPTED)
        
#         return Response({
#             "success": True,
#             "message": "Soil moisture level normal",
#             "data": {
#                 "moisture_level": sensor_data.soil_moisture,
#                 "timestamp": sensor_data.timestamp.isoformat(),
#                 "notification_sent": False
#             }
#         }, status=status.HTTP_200_OK)

#     except ObjectDoesNotExist:
#         error = ApiError(
#             "SENSOR_DATA_NOT_FOUND",
#             "No sensor data available",
#             {"last_checked": datetime.now().isoformat()}
#         )
#         return Response(error.response, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         error = ApiError(
#             "INTERNAL_SERVER_ERROR",
#             "An unexpected error occurred",
#             {"error_type": type(e).__name__, "error_details": str(e)}
#         )
#         return Response(error.response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        