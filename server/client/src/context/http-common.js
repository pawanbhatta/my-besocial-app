import axios from "axios";
console.log(process.env.REACT_APP_BACKEND);
axios.defaults.withCredentials = true;
export default axios.create({
  baseURL: "/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": process.env.REACT_APP_BACKEND,
  },
});
