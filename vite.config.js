import { defineConfig } from "vite"

const isCodeSandbox = "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env

export default defineConfig(({ command }) => {
	const baseUrl =
		command === "serve" ? "https://projet.floriansylvain.fr/Creative_Coding" : ""

	return {
		define: {
			BASE_URL: JSON.stringify(baseUrl),
		},
		root: "src/",
		publicDir: "../static/",
		base: "/Creative_Coding/",
		server: {
			host: true,
			open: !isCodeSandbox, // Open if it's not a CodeSandbox
		},
		build: {
			outDir: "../dist",
			emptyOutDir: true,
		},
	}
})
