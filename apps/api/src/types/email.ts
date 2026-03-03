export interface SendEmailResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

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
