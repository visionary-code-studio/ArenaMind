import { generateGroqResponse } from '../lib/groqService';

describe('groqService unit tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('should return response text from Groq on success', async () => {
    const mockJson = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Groq Success Response',
          },
        },
      ],
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: mockJson,
    });

    const res = await generateGroqResponse('test prompt', 'system instruction');
    expect(res).toBe('Groq Success Response');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('should throw error when api response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    await expect(generateGroqResponse('test prompt')).rejects.toThrow('Groq 403: Forbidden');
  });

  test('should throw error when response content is empty', async () => {
    const mockJson = jest.fn().mockResolvedValue({
      choices: [],
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: mockJson,
    });

    await expect(generateGroqResponse('test prompt')).rejects.toThrow('Groq returned an empty response');
  });
});
