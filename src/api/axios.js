

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',  //local
  //  baseURL : 'http://3.110.50.196:3000/api',  //live
  // baseURL: 'https://admin.reddyannaofficieal.com/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Very important for cookies to be sent
});

export default instance;
