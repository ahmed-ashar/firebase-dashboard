import axios from "axios";

const apiInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export default apiInstance;