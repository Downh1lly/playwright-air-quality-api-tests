import { APIRequestContext } from '@playwright/test';
import { validateLocationsResponse } from '../utils/reponseValidators';

export class OpenAQClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private headers() {
    const apiKey = process.env.X_API_KEY;
    if (!apiKey) throw new Error('X_API_KEY is missing');
    return { 'X-API-Key': apiKey };
  }

  async getLocations(params?: Record<string, string | number | boolean>) {
    const start = performance.now();
    const response = await this.request.get('/v3/locations', {
      headers: this.headers(),
      params,
    });

    const body = await response.json();
    const duration = performance.now() - start;
    console.log(`GET /v3/locations → ${response.status()} (${duration.toFixed(0)} ms)`);
    return { response, body };
  }

  async getLocationsById(id: string) {
    const start = performance.now();
    const response = await this.request.get(`/v3/locations/${id}`, {
      headers: this.headers(),
    });
    const body = await response.json();
    const duration = performance.now() - start;
    console.log(`/v3/locations/${id} → ${response.status()} (${duration.toFixed(0)} ms)`);
    return { response, body };
  }

  async getLocationsByCountry(code: string) {
    const start = performance.now();
    const response = await this.request.get(`/v3/countries/${code}`, {
      headers: this.headers(),
    });
    const body = await response.json();
    const duration = performance.now() - start;
    console.log(`/v3/countries/${code} → ${response.status()} (${duration.toFixed(0)} ms)`);
    return { response, body };
  }

  async getLocationsValidated(params?: Record<string, string | number | boolean>) {
    const {response, body} = await this.getLocations(params);
      if (response.status() !== 200) {
        throw new Error(`Expected status 200, got ${response.status()}`);
      }
      return validateLocationsResponse(body);
  }

  async getLocationByIdValidated(id: string) {
  const { response, body } = await this.getLocationsById(id);
  if (response.status() !== 200) {
    throw new Error(`Expected status 200, got ${response.status()}`);
  }

  const data = validateLocationsResponse(body);
  if (data.results.length !== 1) {
    throw new Error(`Expected exactly 1 result, got ${data.results.length}`);
  }
  return data; 
}
}
