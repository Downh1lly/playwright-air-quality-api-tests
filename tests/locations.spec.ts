import { test, expect } from '../api/fixtures/api.fixture';
import { OpenAQClient } from '../api/clients/OpenAQClient';
import { validateErrorResponse } from '../api/utils/reponseValidators';


test('GET /locations returns 200', async ({ apiClient }) => {
  const data = await apiClient.getLocationsValidated();
  expect(data.results.length).toBeGreaterThan(0);
});

test('GET /locations with limit returns limited results', async ({ apiClient }) => {
  const data = await apiClient.getLocationsValidated({ limit: 5 });
  expect(data.results.length).toBeLessThanOrEqual(5);
});

test('GET /locations by ID', async ({ apiClient }) => {
  const data = await apiClient.getLocationByIdValidated('45');
  expect(data.results[0].id).toBe(45);
});

test('should return validation error for negative location id', async ({ apiClient }) => {
  const { response, body }   = await apiClient.getLocationsById('-45');
  expect(response.status()).toBe(422);

  const error = validateErrorResponse(body);
  expect(error.detail[0].msg).toContain('greater than or equal to 1');
});

test('pagination: different pages return different results', async ({ apiClient }) => {
  const page1 = await apiClient.getLocationsValidated({ limit: 5, page: 1 });
  const page2 = await apiClient.getLocationsValidated({ limit: 5, page: 2 });

  expect(page1.results.length).toBeGreaterThan(0);
  expect(page2.results.length).toBeGreaterThan(0);

  const page1Ids = page1.results.map(loc => loc.id);
  const page2Ids = page2.results.map(loc => loc.id);
  const commonIds = page1Ids.filter(id => page2Ids.includes(id));
  expect(commonIds).toHaveLength(0);
});

test('locations have unique IDs', async ({ apiClient}) => {
  const data = await apiClient.getLocationsValidated();
  const ids = data.results.map(loc => loc.id);
  const uniqueIds = new Set(ids);
  expect(uniqueIds.size).toBe(ids.length);
});

test('locations data integrity: coordinates and sensors are valid', async ({ apiClient }) => {

  const data = await apiClient.getLocationsValidated({ limit: 50 });

  for (const location of data.results) {
    if (!location.coordinates) continue;
    expect(location.coordinates.latitude).toBeGreaterThanOrEqual(-90);
    expect(location.coordinates.latitude).toBeLessThanOrEqual(90);

    expect(location.coordinates.longitude).toBeGreaterThanOrEqual(-180);
    expect(location.coordinates.longitude).toBeLessThanOrEqual(180);

    expect(location.name).toBeTruthy();

    if (location.sensors) {
      expect(Array.isArray(location.sensors)).toBe(true);

      for (const sensor of location.sensors) {
        expect(sensor.name).toBeTruthy();

        if (sensor.parameter) {
          expect(sensor.parameter.name).toBeTruthy();
          expect(sensor.parameter.units).toBeTruthy();
        }
      }
    }
  }
});
