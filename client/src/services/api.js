import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-expense-tracker-api-o6f8.onrender.com/api",
});

export default API;