import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://facebook-mern-2.herokuapp.com/api",
});
