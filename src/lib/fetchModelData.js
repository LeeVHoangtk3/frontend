import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function fetchModel(url) {
  return axios.get(BACKEND_URL + url, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data || `Server returned ${err.response?.status || 'Error'}`);
    });
}

export default fetchModel;
