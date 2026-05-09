// Environment configuration for the frontend
// Update the API_BASE_URL based on your environment

// For development, you have options:
// 1. Localhost (web only): "http://localhost:8000/api"
// 2. PC IP address (device testing): "http://192.168.1.X:8000/api"
// 3. Environment variable (recommended)

export const CONFIG = {
  // Change this to your PC's local IP address when testing on device
  // Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
  // Current PC IP: 192.168.1.4
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.4:8000",
  
  // Set to false for production
  DEBUG: true,
};

export default CONFIG;
