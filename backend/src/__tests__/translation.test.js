const request = require('supertest');
const express = require('express');
const translationRoutes = require('../routes/translation.routes');
const { translateEnglishToChinese, isTranslationAvailable } = require('../services/translation.service');

// Mock the translation service
jest.mock('../services/translation.service', () => ({
  translateEnglishToChinese: jest.fn(),
  isTranslationAvailable: jest.fn()
}));

// Mock auth middleware
jest.mock('../middleware/auth.middleware', () => (req, res, next) => {
  req.user = { id: 'test-user-id', email: 'test@example.com' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/translate', translationRoutes);

describe('Translation API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock translation service as available by default
    isTranslationAvailable.mockReturnValue(true);
  });

  describe('POST /api/translate', () => {
    it('should successfully translate English text to Chinese', async () => {
      const englishText = 'Hello, world!';
      const chineseText = '你好，世界！';

      translateEnglishToChinese.mockResolvedValue(chineseText);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: englishText })
        .expect(200);

      expect(response.body).toMatchObject({
        translatedText: chineseText,
        success: true
      });
      expect(response.body.originalLength).toBe(englishText.length);
      expect(response.body.translatedLength).toBe(chineseText.length);
      expect(translateEnglishToChinese).toHaveBeenCalledWith(englishText);
      expect(translateEnglishToChinese).toHaveBeenCalledTimes(1);
    });

    it('should translate email template with placeholders', async () => {
      const englishTemplate = 'Hello {Name}, you have {Count} items ready for pickup.';
      const chineseTemplate = '你好 {Name}，您有 {Count} 件物品可以领取。';

      translateEnglishToChinese.mockResolvedValue(chineseTemplate);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: englishTemplate })
        .expect(200);

      expect(response.body.translatedText).toBe(chineseTemplate);
      expect(response.body.success).toBe(true);
    });

    it('should translate long text successfully', async () => {
      const longText = 'This is a very long email template with multiple sentences. ' +
        'It contains important information about mail pickup. ' +
        'Please collect your items at your earliest convenience.';
      const translatedText = '这是一个包含多个句子的很长的电子邮件模板。' +
        '它包含有关邮件领取的重要信息。' +
        '请尽早领取您的物品。';

      translateEnglishToChinese.mockResolvedValue(translatedText);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: longText })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.translatedText).toBe(translatedText);
    });

    it('should handle empty text with 400 error', async () => {
      const response = await request(app)
        .post('/api/translate')
        .send({ text: '' })
        .expect(400);

      expect(response.body.error).toBe('Text is required');
      expect(translateEnglishToChinese).not.toHaveBeenCalled();
    });

    it('should handle missing text field with 400 error', async () => {
      const response = await request(app)
        .post('/api/translate')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Text is required');
      expect(translateEnglishToChinese).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only text with 400 error', async () => {
      const response = await request(app)
        .post('/api/translate')
        .send({ text: '   \n  \t  ' })
        .expect(400);

      expect(response.body.error).toBe('Text cannot be empty');
      expect(translateEnglishToChinese).not.toHaveBeenCalled();
    });

    it('should handle non-string text with 400 error', async () => {
      const response = await request(app)
        .post('/api/translate')
        .send({ text: 12345 })
        .expect(400);

      expect(response.body.error).toBe('Text must be a string');
      expect(translateEnglishToChinese).not.toHaveBeenCalled();
    });

    it('should handle text exceeding 10,000 characters with 400 error', async () => {
      const longText = 'a'.repeat(10001);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: longText })
        .expect(400);

      expect(response.body.error).toBe('Text exceeds maximum length of 10,000 characters');
      expect(translateEnglishToChinese).not.toHaveBeenCalled();
    });

    it('should handle exactly 10,000 characters successfully', async () => {
      const maxLengthText = 'a'.repeat(10000);
      const translatedText = '一'.repeat(10000);

      translateEnglishToChinese.mockResolvedValue(translatedText);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: maxLengthText })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(translateEnglishToChinese).toHaveBeenCalledWith(maxLengthText);
    });

    it('should handle translation service errors gracefully', async () => {
      const errorMessage = 'AWS service error';
      translateEnglishToChinese.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello' })
        .expect(500);

      expect(response.body.error).toBe('Translation failed. Please try again.');
    });

    it('should handle special characters in text', async () => {
      const specialText = 'Hello! How are you? I\'m fine. #grateful @work & happy 😊';
      const translatedText = '你好！你好吗？我很好。#感恩 @工作 & 快乐 😊';

      translateEnglishToChinese.mockResolvedValue(translatedText);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: specialText })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.translatedText).toBe(translatedText);
    });

    it('should handle multiline text', async () => {
      const multilineText = 'Hello {Name},\n\nYou have mail ready for pickup.\n\nBest regards,\nMei Way Mail Plus';
      const translatedText = '你好 {Name}，\n\n您有邮件可以领取。\n\n此致敬礼，\n美威邮件中心';

      translateEnglishToChinese.mockResolvedValue(translatedText);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: multilineText })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.translatedText).toBe(translatedText);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow up to 20 requests per minute', async () => {
      translateEnglishToChinese.mockResolvedValue('翻译文本');

      // Make 20 requests - all should succeed
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(app)
            .post('/api/translate')
            .send({ text: `Test ${i}` })
        );
      }

      const responses = await Promise.all(requests);
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});

describe('Translation Service Integration', () => {
  describe('translateEnglishToChinese', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be called with correct parameters', async () => {
      const text = 'Test translation';
      translateEnglishToChinese.mockResolvedValue('测试翻译');

      await request(app)
        .post('/api/translate')
        .send({ text });

      expect(translateEnglishToChinese).toHaveBeenCalledWith(text);
    });

    it('should handle AWS configuration errors', async () => {
      isTranslationAvailable.mockReturnValue(false);

      const response = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello' })
        .expect(503);

      expect(response.body.error).toBe('Translation service is not configured. Please contact the administrator.');
    });
  });
});
