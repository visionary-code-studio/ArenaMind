import { generateGeminiResponse } from '../lib/geminiService';

const mockGenerateContent = jest.fn();
(global as any).mockGenerateContent = mockGenerateContent;

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: (...args: any[]) => (global as any).mockGenerateContent(...args),
        },
      };
    }),
  };
});

describe('geminiService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return response text from Gemini when call is successful', async () => {
    mockGenerateContent.mockResolvedValue({
      text: 'Gemini Success Output',
    });

    const res = await generateGeminiResponse('test prompt', 'system instruction');
    expect(res).toBe('Gemini Success Output');
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: 'test prompt',
      config: {
        temperature: 0.1,
        maxOutputTokens: 800,
        systemInstruction: 'system instruction',
      },
    });
  });

  test('should throw error when text is empty', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '',
    });

    await expect(generateGeminiResponse('test prompt')).rejects.toThrow('Gemini returned an empty response');
  });

  test('should throw error when api call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));

    await expect(generateGeminiResponse('test prompt')).rejects.toThrow('API Error');
  });
});
