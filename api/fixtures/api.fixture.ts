import { test as base, expect } from '@playwright/test';
import { OpenAQClient } from '../clients/OpenAQClient';

type Fixtures = {
  apiClient: OpenAQClient;
};

export const test = base.extend<Fixtures>({
  apiClient: async ({ request }, use) => {
    const client = new OpenAQClient(request);
    await use(client);
  },
});

export { expect };

