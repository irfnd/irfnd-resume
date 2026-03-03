import { sendContactEmail, setEmailClient } from '@/services/email';
import type { EmailClient } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Email Service', () => {
	let mockEmailClient: EmailClient;
	const originalEnv = process.env;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.stubEnv('EMAIL_TO', 'recipient@example.com');
		vi.stubEnv('EMAIL_FROM', 'sender@example.com');

		mockEmailClient = {
			emails: {
				send: vi.fn().mockResolvedValue({ data: { id: 'msg_123' }, error: null }),
			},
		};
		setEmailClient(mockEmailClient);
	});

	afterEach(() => {
		process.env = originalEnv;
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	const validData = {
		fullName: 'John Doe',
		email: 'john@example.com',
		telephone: '1234567890',
		subject: 'Test Subject',
		message: 'This is a test message.',
	};

	describe('sendContactEmail', () => {
		it('should send email successfully', async () => {
			const result = await sendContactEmail(validData);

			expect(result.success).toBe(true);
			expect(result.messageId).toBe('msg_123');
			expect(mockEmailClient.emails.send).toHaveBeenCalledOnce();
		});

		it('should use correct email addresses', async () => {
			await sendContactEmail(validData);

			expect(mockEmailClient.emails.send).toHaveBeenCalledWith(
				expect.objectContaining({
					from: 'sender@example.com',
					to: 'recipient@example.com',
					replyTo: 'john@example.com',
				}),
			);
		});

		it('should format subject correctly', async () => {
			await sendContactEmail(validData);

			expect(mockEmailClient.emails.send).toHaveBeenCalledWith(
				expect.objectContaining({
					subject: '[Contact Form] Test Subject',
				}),
			);
		});

		it('should include all form data in HTML', async () => {
			await sendContactEmail(validData);

			const call = vi.mocked(mockEmailClient.emails.send).mock.calls[0][0];
			expect(call.html).toContain('John Doe');
			expect(call.html).toContain('john@example.com');
			expect(call.html).toContain('1234567890');
			expect(call.html).toContain('Test Subject');
			expect(call.html).toContain('This is a test message.');
		});

		it('should include all form data in plain text', async () => {
			await sendContactEmail(validData);

			const call = vi.mocked(mockEmailClient.emails.send).mock.calls[0][0];
			expect(call.text).toContain('John Doe');
			expect(call.text).toContain('john@example.com');
			expect(call.text).toContain('1234567890');
			expect(call.text).toContain('Test Subject');
			expect(call.text).toContain('This is a test message.');
		});

		it('should convert newlines to br tags in HTML', async () => {
			const dataWithNewlines = {
				...validData,
				message: 'Line 1\nLine 2\nLine 3',
			};
			await sendContactEmail(dataWithNewlines);

			const call = vi.mocked(mockEmailClient.emails.send).mock.calls[0][0];
			expect(call.html).toContain('Line 1<br />Line 2<br />Line 3');
		});

		it('should return error when EMAIL_TO is not set', async () => {
			vi.stubEnv('EMAIL_TO', '');

			const result = await sendContactEmail(validData);

			expect(result.success).toBe(false);
			expect(result.error).toBe('Email configuration error');
			expect(mockEmailClient.emails.send).not.toHaveBeenCalled();
		});

		it('should use default FROM email when EMAIL_FROM is not set', async () => {
			vi.stubEnv('EMAIL_FROM', '');

			await sendContactEmail(validData);

			expect(mockEmailClient.emails.send).toHaveBeenCalledWith(
				expect.objectContaining({
					from: 'onboarding@resend.dev',
				}),
			);
		});

		it('should handle API errors', async () => {
			vi.mocked(mockEmailClient.emails.send).mockResolvedValue({
				data: null,
				error: { message: 'API rate limit exceeded' },
			});

			const result = await sendContactEmail(validData);

			expect(result.success).toBe(false);
			expect(result.error).toBe('API rate limit exceeded');
		});

		it('should handle exceptions', async () => {
			vi.mocked(mockEmailClient.emails.send).mockRejectedValue(new Error('Network error'));

			const result = await sendContactEmail(validData);

			expect(result.success).toBe(false);
			expect(result.error).toBe('Failed to send email');
		});
	});
});
