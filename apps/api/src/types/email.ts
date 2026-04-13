export type SendEmailResult = { success: true; messageId?: string } | { success: false; error: string };

export interface EmailClient {
	emails: {
		send: (params: {
			from: string;
			to: string;
			replyTo: string;
			subject: string;
			html: string;
			text: string;
		}) => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
	};
}
