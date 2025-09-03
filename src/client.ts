import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { JoyApiOptions, SuccessResponse, ErrorResponse } from './types';
import { JoyApiError } from './errors';

export class JoyApiClient {
  private axios: AxiosInstance;
  private appKey: string;
  private secretKey: string;
  private maxRetries: number;

  constructor(options: JoyApiOptions) {
    this.appKey = options.appKey;
    this.secretKey = options.secretKey;
    this.maxRetries = options.maxRetries || 3;

    this.axios = axios.create({
      baseURL: options.baseUrl || 'https://api.joy.so',
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Joy-Loyalty-App-Key': this.appKey,
        'X-Joy-Loyalty-Secret-Key': this.secretKey,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        if (!config || !config.retryCount) {
          config.retryCount = 0;
        }

        if (config.retryCount >= this.maxRetries) {
          return Promise.reject(this.handleError(error));
        }

        if (this.shouldRetry(error)) {
          config.retryCount++;
          const delay = this.getRetryDelay(config.retryCount);
          await this.sleep(delay);
          return this.axios(config);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private shouldRetry(error: any): boolean {
    if (!error.response) {
      return true;
    }
    
    const status = error.response.status;
    return status === 429 || status === 503 || status >= 500;
  }

  private getRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: any): JoyApiError {
    if (error.response) {
      const data = error.response.data as ErrorResponse;
      return new JoyApiError(
        data.error?.message || 'Unknown error',
        data.error?.statusCode || error.response.status,
        data.error?.code || 'UNKNOWN_ERROR',
        data.error?.details
      );
    }
    
    if (error.request) {
      return new JoyApiError(
        'No response received from server',
        0,
        'NO_RESPONSE'
      );
    }
    
    return new JoyApiError(
      error.message || 'Unknown error',
      0,
      'REQUEST_ERROR'
    );
  }

  async get<T = any>(path: string, params?: any): Promise<SuccessResponse<T>> {
    const response = await this.axios.get<SuccessResponse<T>>(path, { params });
    return response.data;
  }

  async post<T = any>(path: string, data?: any): Promise<SuccessResponse<T>> {
    const response = await this.axios.post<SuccessResponse<T>>(path, data);
    return response.data;
  }

  async put<T = any>(path: string, data?: any): Promise<SuccessResponse<T>> {
    const response = await this.axios.put<SuccessResponse<T>>(path, data);
    return response.data;
  }

  async delete<T = any>(path: string, params?: any): Promise<SuccessResponse<T>> {
    const response = await this.axios.delete<SuccessResponse<T>>(path, { params });
    return response.data;
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<SuccessResponse<T>> {
    const response = await this.axios.request<SuccessResponse<T>>(config);
    return response.data;
  }
}