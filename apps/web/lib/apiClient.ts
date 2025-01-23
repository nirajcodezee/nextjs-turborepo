import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Function to create an Axios instance with configuration
const createApiClient = (baseURL: string) => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    // timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      // Modify request, e.g., adding authentication token
      // const token = localStorage.getItem('authToken');
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      console.error('API Error:', error.response || error.message);
      return Promise.reject(error.response || error.message);
    }
  );

  const request = async <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data: Record<string, any> | null = null,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    // try {
      const response: AxiosResponse<T> = await axiosInstance.request<T>({
        url,
        method,
        data,
        ...config,
      });

      return response.data;

    // } catch (error: unknown) {
    //   throw error;
    // }
  };

  return {
    request,
  };
};

// Create an instance of the API client
const apiClient = createApiClient('http://localhost:8000/');

// Export the client instance
export { apiClient };
