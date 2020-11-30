import axios from 'axios';
import Config from './config';

/**
 * Axios defaults
 */
axios.defaults.baseURL = Config.apiBaseUrl;

// Headers
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig;
    config.headers.common['Access-Control-Allow-Origin'] = "*";
    // Check for and add the stored Auth Token to the header request
    {/*let token = '';
    try {
      token = await AsyncStorage.getItem('@Auth:token');
    } catch (error) {
      /* Nothing */
    }
    {/*
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`;
    }*/}
    console.log("MIDDLEWEAR CONFIG", config)
    return config;
  },
  (error) => {
    throw error;
},
);

/**
 * Response Interceptor
 */
axios.interceptors.response.use(
  (res) => {
    // Status code isn't a success code - throw error
    if (!`${res.status}`.startsWith('2')) {
      throw res.data;
    }
    // Otherwise just return the data
    return res;
  },
  (error) => {
    // Pass the response from the API, rather than a status code
    if (error && error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  },
);

export default axios;