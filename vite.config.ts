import {
  defineConfig,
  loadEnv,
  type Plugin,
} from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import githubActivityHandler from "./api/github-activity";

const githubActivityDevApi = (): Plugin => ({
  name: "github-activity-dev-api",
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const requestUrl = new URL(
        request.url ?? "/",
        "http://localhost",
      );
      if (requestUrl.pathname !== "/api/github-activity") {
        next();
        return;
      }

      const apiResponse: Parameters<
        typeof githubActivityHandler
      >[1] = {
        json(body) {
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(body));
        },
        setHeader(name, value) {
          response.setHeader(name, value);
        },
        status(statusCode) {
          response.statusCode = statusCode;
          return apiResponse;
        },
      };

      try {
        await githubActivityHandler(
          { method: request.method },
          apiResponse,
        );
      } catch (error: unknown) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error(String(error));
        server.config.logger.error(
          "GitHub activity development endpoint failed.",
          { error: normalizedError },
        );
        if (!response.writableEnded) {
          response.statusCode = 500;
          response.end(
            JSON.stringify({
              error: "GitHub activity is temporarily unavailable.",
            }),
          );
        }
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  const githubToken =
    process.env.GITHUB_TOKEN || environment.GITHUB_TOKEN;
  if (githubToken) process.env.GITHUB_TOKEN = githubToken;

  return {
    plugins: [
      githubActivityDevApi(),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
