// services/authService.js
import api from "../store/axios";

export const loginUser = async (formData) => {
  return api.post("auth/login", formData);
};

export const registerUser = async (formData) => {
  return api.post("auth/register", formData);
};
