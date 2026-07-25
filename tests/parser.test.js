const { auditUrl } = require('../parser');
const axios = require('axios');

jest.mock('axios');

describe('auditUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Happy path: parses a standard HTML page correctly', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
        <meta name="description" content="A test description">
      </head>
      <body>
        <h1>Heading 1</h1>
        <h1>Heading 2</h1>
        <img src="test1.jpg" alt="valid alt">
        <img src="test2.jpg" alt="">
        <img src="test3.jpg">
        <p>This is a test paragraph with some words.</p>
      </body>
      </html>
    `;
    
    axios.get.mockResolvedValue({
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8'
      },
      data: mockHtml
    });

    const result = await auditUrl('https://example.com');
    
    expect(result.status).toBe(200);
    expect(result.title).toBe('Test Page');
    expect(result.metaDescription).toBe('A test description');
    expect(result.h1Count).toBe(2);
    expect(result.imagesMissingAlt).toBe(2);
    expect(result.wordCount).toBe(12);
    expect(result.responseTime).toMatch(/\d+ms/);
  });

  test('Failure case 1: throws error on invalid URL format', async () => {
    await expect(auditUrl('not-a-valid-url')).rejects.toThrow('Invalid URL format');
  });

  test('Failure case 2: throws error on non-HTML response', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      data: { hello: "world" }
    });

    await expect(auditUrl('https://api.example.com/data')).rejects.toThrow('Non-HTML response received');
  });
  
  test('Failure case 3: handles timeouts properly', async () => {
    axios.get.mockRejectedValue({
      code: 'ECONNABORTED',
      message: 'timeout of 10000ms exceeded'
    });

    await expect(auditUrl('https://slow.example.com')).rejects.toThrow('Request timed out');
  });
});
