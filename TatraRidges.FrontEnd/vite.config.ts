/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	server: { port: 3000 },
	// firebase.json serves this folder
	build: {
		outDir: "build",
		rolldownOptions: {
			output: {
				// Libraries in their own chunks: smaller entry chunk, cached across app deploys.
				// A group also takes the dependencies of its modules, so React goes first
				// (an earlier group wins); otherwise react-leaflet would pull React into "leaflet".
				codeSplitting: {
					groups: [
						{ name: "react", test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
						{ name: "leaflet", test: /[\\/]node_modules[\\/](@react-leaflet|react-leaflet|leaflet)[\\/]/ },
					],
				},
			},
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.ts",
		css: { modules: { classNameStrategy: "non-scoped" } },
	},
})
