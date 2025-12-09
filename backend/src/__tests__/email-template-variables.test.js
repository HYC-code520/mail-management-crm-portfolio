/**
 * Tests for template variable replacement
 * Ensures both {VAR} and {{VAR}} formats work (Error #32)
 */

// Mock Gmail API
const mockGmailSend = jest.fn().mockResolvedValue({ data: { id: 'msg-123' } });
jest.mock('googleapis', () => ({
  google: {
    gmail: jest.fn(() => ({
      users: {
        messages: {
          send: mockGmailSend
        }
      }
    })),
    auth: {
      OAuth2: jest.fn()
    }
  }
}));

// Mock OAuth2 service
jest.mock('../services/oauth2.service', () => ({
  getValidOAuthClient: jest.fn().mockResolvedValue({
    credentials: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    }
  }),
  getUserGmailAddress: jest.fn().mockResolvedValue('sender@example.com')
}));

const { sendTemplateEmail } = require('../services/email.service');

describe('Email Service - Template Variable Replacement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGmailSend.mockClear();
  });

  describe('Single Brace Format {VAR}', () => {
    it('should replace {Name} with actual name', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Hello {Name}',
        templateBody: 'Dear {Name}, your mail is ready.',
        variables: { Name: 'John Doe' },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const encodedMessage = callArgs.requestBody.raw;
      const decodedMessage = Buffer.from(
        encodedMessage.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Subject: Hello John Doe');
      expect(decodedMessage).toContain('Dear John Doe, your mail is ready.');
      expect(decodedMessage).not.toContain('{Name}');
    });

    it('should replace {BoxNumber} with mailbox number', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Mail Ready',
        templateBody: 'Mailbox: {BoxNumber}',
        variables: { BoxNumber: 'B123' },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Mailbox: B123');
      expect(decodedMessage).not.toContain('{BoxNumber}');
    });

    it('should replace multiple {VAR} variables in template', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Hello {Name}',
        templateBody: 'Hello {Name},\n\nYou have {LetterCount} {LetterText} ready.\n\nMailbox: {BoxNumber}\nDate: {Date}',
        variables: {
          Name: 'Jane Smith',
          LetterCount: 3,
          LetterText: 'letters',
          BoxNumber: 'A456',
          Date: 'December 9, 2025'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Hello Jane Smith');
      expect(decodedMessage).toContain('You have 3 letters ready');
      expect(decodedMessage).toContain('Mailbox: A456');
      expect(decodedMessage).toContain('Date: December 9, 2025');
      expect(decodedMessage).not.toContain('{Name}');
      expect(decodedMessage).not.toContain('{LetterCount}');
      expect(decodedMessage).not.toContain('{LetterText}');
    });
  });

  describe('Double Brace Format {{VAR}}', () => {
    it('should replace {{Name}} with actual name', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Hello {{Name}}',
        templateBody: 'Dear {{Name}}, your package is ready.',
        variables: { Name: 'Alice Johnson' },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Subject: Hello Alice Johnson');
      expect(decodedMessage).toContain('Dear Alice Johnson, your package is ready.');
      expect(decodedMessage).not.toContain('{{Name}}');
    });

    it('should replace multiple {{VAR}} variables', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Package for {{Name}}',
        templateBody: 'Hello {{Name}},\n\nYou have {{PackageCount}} {{PackageText}}.\n\nBox: {{BoxNumber}}',
        variables: {
          Name: 'Bob Chen',
          PackageCount: 2,
          PackageText: 'packages',
          BoxNumber: 'C789'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Package for Bob Chen');
      expect(decodedMessage).toContain('Hello Bob Chen');
      expect(decodedMessage).toContain('You have 2 packages');
      expect(decodedMessage).toContain('Box: C789');
    });
  });

  describe('Mixed Format {VAR} and {{VAR}}', () => {
    it('should replace both formats in same template', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Mail for {Name}',
        templateBody: 'Hello {{Name}},\n\nYou have {LetterCount} letters at mailbox {{BoxNumber}}.',
        variables: {
          Name: 'Charlie Wang',
          LetterCount: 5,
          BoxNumber: 'D101'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Mail for Charlie Wang');
      expect(decodedMessage).toContain('Hello Charlie Wang');
      expect(decodedMessage).toContain('You have 5 letters');
      expect(decodedMessage).toContain('mailbox D101');
      expect(decodedMessage).not.toContain('{Name}');
      expect(decodedMessage).not.toContain('{{Name}}');
    });
  });

  describe('Pluralization Variables', () => {
    it('should replace {LetterText} with "letter" or "letters"', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Mail Ready',
        templateBody: 'You have {LetterCount} {LetterText} ready.',
        variables: {
          LetterCount: 1,
          LetterText: 'letter'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('You have 1 letter ready');
    });

    it('should replace {PackageText} with "package" or "packages"', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Packages Ready',
        templateBody: 'You have {PackageCount} {PackageText} ready.',
        variables: {
          PackageCount: 3,
          PackageText: 'packages'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('You have 3 packages ready');
    });
  });

  describe('Bilingual Templates', () => {
    it('should replace variables in both English and Chinese sections', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Mail for {Name}',
        templateBody: 'Hello {Name},\n\nYou have {LetterCount} letters.\n\nMailbox: {BoxNumber}\n\n---\n\n{Name} 您好，\n\n您有 {LetterCount} 封信件。\n\n邮箱号：{BoxNumber}',
        variables: {
          Name: 'David Li',
          LetterCount: 2,
          BoxNumber: 'E202'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      // English section
      expect(decodedMessage).toContain('Hello David Li');
      expect(decodedMessage).toContain('You have 2 letters');
      expect(decodedMessage).toContain('Mailbox: E202');
      
      // Chinese section
      expect(decodedMessage).toContain('David Li 您好');
      expect(decodedMessage).toContain('您有 2 封信件');
      expect(decodedMessage).toContain('邮箱号：E202');
      
      // No unreplaced variables
      expect(decodedMessage).not.toContain('{Name}');
      expect(decodedMessage).not.toContain('{LetterCount}');
      expect(decodedMessage).not.toContain('{BoxNumber}');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string variables', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Test',
        templateBody: 'Name: {Name}, Box: {BoxNumber}',
        variables: {
          Name: '',
          BoxNumber: ''
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Name: , Box:');
    });

    it('should handle missing variables gracefully', async () => {
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Test',
        templateBody: 'Hello {Name}, Box {BoxNumber}',
        variables: {
          Name: 'Test User'
          // BoxNumber is missing
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      expect(decodedMessage).toContain('Hello Test User');
      expect(decodedMessage).toContain('Box '); // Empty for missing variable
    });
  });

  describe('Regression Prevention (Error #32)', () => {
    it('should NEVER fail to replace {VAR} format variables', async () => {
      // This test ensures we don't regress to only supporting {{VAR}}
      await sendTemplateEmail({
        to: 'test@example.com',
        templateSubject: 'Test {Name}',
        templateBody: 'Hello {Name}, mailbox {BoxNumber}',
        variables: {
          Name: 'Regression Test',
          BoxNumber: 'R999'
        },
        userId: 'user-123'
      });

      const callArgs = mockGmailSend.mock.calls[0][0];
      const decodedMessage = Buffer.from(
        callArgs.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString();

      // If this fails, we've regressed to the broken implementation
      expect(decodedMessage).not.toContain('{Name}');
      expect(decodedMessage).not.toContain('{BoxNumber}');
      expect(decodedMessage).toContain('Regression Test');
      expect(decodedMessage).toContain('R999');
    });
  });
});

