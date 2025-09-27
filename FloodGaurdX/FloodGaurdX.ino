#include <WiFi.h>
#include <HTTPClient.h>

// ---------- WiFi ----------
#define WIFI_SSID "Galaxy A20s2640"
#define WIFI_PASSWORD "ekxr9282"

// ---------- Pins ----------
#define TRIG_PIN 5
#define ECHO_PIN 18
#define WATER_SENSOR 34
#define RELAY_PIN 23

// ---------- Variables ----------
long duration;
int distance;
int waterValue;

// ---------- Firebase URL ----------
const char* FIREBASE_DB_URL = "https://floodguardx1-6ed9f-default-rtdb.asia-southeast1.firebasedatabase.app";

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  // ---------- Connect WiFi ----------
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\n✅ Connected to Wi-Fi");
}

void loop() {
  // ---------- Ultrasonic ----------
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  distance = duration * 0.034 / 2; // cm

  // ---------- Water Sensor ----------
  waterValue = analogRead(WATER_SENSOR);

  // ---------- Decide Status ----------
  String alert;
  if (waterValue > 500) {
    alert = "Flood Detected 🚨";
    digitalWrite(RELAY_PIN, LOW);
  } 
  else if (distance < 20) {
    alert = "Warning ⚠️";
    digitalWrite(RELAY_PIN, HIGH);
  } 
  else {
    alert = "Safe ✅";
    digitalWrite(RELAY_PIN, HIGH);
  }

  // ---------- Log ----------
  String logLine = "Distance: " + String(distance) + " cm | Water Sensor: " + String(waterValue) + " | Status: " + alert;
  Serial.println(logLine);

  // ---------- Send to Firebase ----------
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // ---------- Update main values ----------
    String url = String(FIREBASE_DB_URL) + "/FloodGuard.json"; // Root node
    String json = "{\"distance\":" + String(distance) + 
                  ",\"waterValue\":" + String(waterValue) + 
                  ",\"alert\":\"" + alert + "\"}";
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PUT(json);  // PUT updates values
    
    if (httpResponseCode > 0) {
      Serial.println("✅ Data updated successfully");
    } else {
      Serial.print("❌ Error updating data: ");
      Serial.println(httpResponseCode);
    }
    http.end();

    // ---------- Push log entry ----------
    String logUrl = String(FIREBASE_DB_URL) + "/FloodGuard/logs.json";
    String logJson = "{\"message\":\"" + logLine + "\"}";

    http.begin(logUrl);
    http.addHeader("Content-Type", "application/json");
    int logResponse = http.POST(logJson);  // POST creates new child
    if (logResponse > 0) {
      Serial.println("✅ Log pushed successfully");
    } else {
      Serial.print("❌ Error pushing log: ");
      Serial.println(logResponse);
    }
    http.end();
  }

  delay(2000);
}
