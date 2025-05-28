# Smart Home Control UI

This is a **web-based frontend interface** for controlling an entire Smart Home Laboratory via the **OpenHAB REST API**.  
The interface is optimized for desktops, tablets, and integrated use with other control systems (e.g., Pepper robot).

---

## 🌐 Overview

- 🧠 Connects to OpenHAB using the REST API
- 🏡 Controls devices like lights, shutters, plugs, scenes, etc.
- 🔐 Supports basic HTTP authentication

### 2. Configure OpenHAB Endpoint & Credentials

You must update the credentials in `controllers/main.js` to match your OpenHAB setup.

Locate the following line in `main.js`:

const model = new OpenHAB("http://192.168.0.5:8080/rest", "login", "password");

🔒 Replace "login" and "password" with your actual OpenHAB credentials.
Also ensure that the IP address matches your OpenHAB server.

🛠 Features
🔘 Manual Device Control
Switch lights, adjust blinds, and control other smart devices.

🗓️ Scenario Support
Trigger scenes like "Start Meeting" that execute multiple actions at once.

🔄 Live Status Fetching
Dynamically updates the UI based on current OpenHAB item states.

👤 Basic Authentication
Secure communication via HTTP Basic Auth (built-in to OpenHAB REST API).

🙋 Contact
Developed by KamikotoBaka
Smart Home Lab – Hochschule Furtwangen
