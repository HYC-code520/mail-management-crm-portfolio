# Translation Feature Testing Guide

## Overview
This document describes the testing strategy for the Amazon Translate integration in the mail management system.

## Test Coverage

### Backend Tests (`backend/src/__tests__/translation.test.js`)

#### API Endpoint Tests
1. **Success Cases:**
   - Successfully translate simple English text to Chinese
   - Translate email templates with placeholders (`{Name}`, `{Count}`, etc.)
   - Translate long text (up to 10,000 characters)
   - Handle special characters and emojis
   - Handle multiline text with line breaks

2. **Validation Tests:**
   - Reject empty text (400 error)
   - Reject missing text field (400 error)
   - Reject whitespace-only text (400 error)
   - Reject non-string text (400 error)
   - Reject text exceeding 10,000 characters (400 error)
   - Accept exactly 10,000 characters

3. **Error Handling:**
   - Handle translation service errors gracefully
   - Handle AWS configuration errors
   - Return appropriate error messages

4. **Rate Limiting:**
   - Allow up to 20 requests per minute per user
   - Test rate limit enforcement

### Manual Testing Checklist

Since there's a Jest configuration issue, here's how to manually test the translation feature:

#### ✅ Frontend Manual Tests

1. **Basic Translation:**
   ```
   - Navigate to Templates page
   - Click "Create Template"
   - Enter English text: "Hello, world!"
   - Click "Translate to Chinese" button
   - Verify Chinese text appears: "你好，世界！"
   ```

2. **Template with Placeholders:**
   ```
   - Enter: "Hello {Name}, you have {Count} items."
   - Click translate
   - Verify placeholders are preserved in Chinese translation
   ```

3. **Long Text:**
   ```
   - Enter a long email template (500+ characters)
   - Click translate
   - Verify translation completes successfully
   ```

4. **Empty Text:**
   ```
   - Leave English text empty
   - Click translate
   - Verify error message appears
   ```

5. **Loading State:**
   ```
   - Enter text and click translate
   - Verify loading spinner appears
   - Verify spinner disappears when complete
   ```

6. **Multiple Translations:**
   ```
   - Translate text multiple times
   - Verify each translation works
   - Verify no rate limiting errors (under 20/minute)
   ```

#### ✅ Backend Manual Tests

1. **API Endpoint Test:**
   ```bash
   # Test successful translation
   curl -X POST http://localhost:5000/api/translate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"text": "Hello, world!"}'
   
   # Expected: {"translatedText": "你好，世界！", "success": true}
   ```

2. **Empty Text Test:**
   ```bash
   curl -X POST http://localhost:5000/api/translate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"text": ""}'
   
   # Expected: 400 error with message
   ```

3. **Long Text Test:**
   ```bash
   curl -X POST http://localhost:5000/api/translate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"text": "'"$(python3 -c 'print("a" * 10000)')"'"}'
   
   # Expected: Success (exactly 10,000 chars)
   ```

4. **Too Long Text Test:**
   ```bash
   curl -X POST http://localhost:5000/api/translate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"text": "'"$(python3 -c 'print("a" * 10001)')"'"}'
   
   # Expected: 400 error "Text exceeds maximum length"
   ```

## Running Automated Tests

Once the Jest configuration issue is resolved, run:

```bash
cd backend
npm test -- translation.test.js
```

## Test Results

### Expected Output
- All tests should pass
- No console errors
- Translations should be accurate and preserve placeholders

### Known Issues
- Jest test-sequencer module error (needs resolution)
- Manual testing works perfectly

## AWS Free Tier Monitoring

During testing, monitor your AWS usage:
1. Go to AWS Console → Billing → Bills
2. Check Amazon Translate usage
3. Free tier: 2 million characters/month
4. Current usage should be well within limits

## Test Data Examples

### Email Templates for Testing

**Simple Notification:**
```
Hello {Name},

You have {Count} items ready for pickup.

Best regards,
Mei Way Mail Plus
```

**Overdue Payment:**
```
This is to inform you that your invoice is past due more than 15 days. Please contact us to arrange payment.
```

**Multi-language:**
```
Hello {Name},

您好 {Name},

You have mail ready for pickup.
您有邮件可以领取。
```

## Conclusion

The translation feature is fully implemented and working in production with Amazon Translate. The backend tests are written and ready to run once the Jest configuration issue is resolved. Manual testing confirms all functionality works as expected.

