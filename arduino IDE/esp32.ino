#include <Wire.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Pin Definitions
#define SOIL_SENSOR_PIN 33
#define DHT_PIN 15
#define RELAY_PIN 4

// DHT Sensor
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// Wi-Fi credentials
// const char* ssid = "IIC_WIFI";
// const char* password = "!tah@rIntl2025";
const char* ssid = "DBK";
const char* password = "sarika430522";


// Django API endpoints
const char* sensorDataEndpoint = "https://plant-health-iot-1.onrender.com/api/sensors/";
const char* motorControlEndpoint = "https://plant-health-iot-1.onrender.com/api/hydrate/";

// Motor control flag
bool shouldRunMotor = false;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void sendSensorData(float soilMoisture, float temperature, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(sensorDataEndpoint);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON document
    StaticJsonDocument<200> doc;
    doc["soilmoisture"] = soilMoisture;  // Changed from soil_moisture to soilmoisture
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    
    // Serialize JSON to string
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void checkMotorControl() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(motorControlEndpoint);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Motor Control Response: " + response);
      
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, response);
      if (!error) {
        shouldRunMotor = doc["run_motor"];
      } else {
        Serial.println("Failed to parse JSON response.");
      }
    }
    http.end();
  }
}

void loop() {
  // Reconnect Wi-Fi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }
    Serial.println("\nReconnected to Wi-Fi.");
  }

  // Read sensors
  int soilMoisture = analogRead(SOIL_SENSOR_PIN);
  float soilMoisturePercentage = map(soilMoisture, 0, 4095, 0, 100);
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check if sensor readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print sensor values to Serial
  Serial.print("Soil Moisture (%): ");
  Serial.println(soilMoisturePercentage);
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C, Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  // Send sensor data to server
  sendSensorData(soilMoisturePercentage, temperature, humidity);

  // Check motor control status
  checkMotorControl();

  // Control the water pump based on the server command
  if (shouldRunMotor) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Water pump ON");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Water pump OFF");
  }

  delay(20000);
}