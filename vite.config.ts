import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let reactPlugin: any = null;
  try {
    const reactModule = await import("@vitejs/plugin-react");
    // @ts-ignore
    reactPlugin = reactModule.default ? reactModule.default() : null;
  } catch (e) {
    // Fallback: run without React plugin if not installed
    reactPlugin = null;
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: reactPlugin ? [reactPlugin] : [],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
