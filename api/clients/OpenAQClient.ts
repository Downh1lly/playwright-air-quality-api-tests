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

  private async requestJson(
    path: string,
    logPath: string,
    params?: Record<string, string | number | boolean>,
  ) {
    const start = performance.now();
    const response = await this.request.get(path, {
      headers: this.headers(),
      params,
    });
    const body = await response.json();
    const duration = performance.now() - start;
    console.log(`${logPath} → ${response.status()} (${duration.toFixed(0)} ms)`);
    return { response, body };
  }

  async getLocations(params?: Record<string, string | number | boolean>) {
    return this.requestJson('/v3/locations', 'GET /v3/locations', params);
  }

  async getLocationsById(id: string) {
    return this.requestJson(`/v3/locations/${id}`, `/v3/locations/${id}`);
  }

  async getLocationsByCountry(code: string) {
    return this.requestJson(`/v3/countries/${code}`, `/v3/countries/${code}`);
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
