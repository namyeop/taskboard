import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		browser: {
			provider: "playwright", // or 'webdriverio'
			enabled: true,
			headless: true,
			name: "chromium", // browser name is required
		},
	},
});
