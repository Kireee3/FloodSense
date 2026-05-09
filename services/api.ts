// API Service for connecting to the backend
import { CONFIG } from "../constants/config";

export const apiClient = {
  // Auth endpoints
  sendOtp: async (phone: string) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  },

  verifyOtp: async (phone: string, code: string) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },

  // Alerts endpoints
  getAlerts: async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/alerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  createAlert: async (alertData: any) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    }
  },
};

export default apiClient;
