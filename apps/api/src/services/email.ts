import type { ContactFormData } from '@/schemas/contact';
import type { EmailClient, SendEmailResult } from '@/types';
import { escapeHtml } from '@/utils';
import { Resend } from 'resend';

let emailClient: EmailClient | null = null;

function getDefaultClient(): EmailClient {
	return new Resend(process.env.RESEND_API_KEY);
}

export function setEmailClient(client: EmailClient | null) {
	emailClient = client;
}

export function getEmailClient(): EmailClient {
	if (!emailClient) {
		emailClient = getDefaultClient();
	}
	return emailClient;
}

export async function sendContactEmail(data: ContactFormData): Promise<SendEmailResult> {
	const emailTo = process.env.EMAIL_TO;
	const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

	if (!emailTo) {
		console.error('EMAIL_TO environment variable is not set');
		return { success: false, error: 'Email configuration error' };
	}

	const client = getEmailClient();

	try {
		const { data: result, error } = await client.emails.send({
			from: emailFrom,
			to: emailTo,
			replyTo: data.email,
			subject: `[Contact Form] ${data.subject}`,
			html: `
				<h2>New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
				<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
				<p><strong>Phone:</strong> ${escapeHtml(data.telephone)}</p>
				<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
				<hr />
				<h3>Message:</h3>
				<p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
			`,
			text: `
New Contact Form Submission

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.telephone}
Subject: ${data.subject}

Message:
${data.message}
			`,
		});

		if (error) {
			console.error('Resend API error:', error);
			return { success: false, error: error.message };
		}

		return { success: true, messageId: result?.id };
	} catch (err) {
		console.error('Email sending error:', err);
		return { success: false, error: 'Failed to send email' };
	}
}
