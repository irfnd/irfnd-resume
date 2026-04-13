/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_API_URL: string;
	readonly PUBLIC_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
