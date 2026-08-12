import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import "colors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { clean as xssClean } from "xss-clean/lib/xss";
import globalErrorHandler from "@src/controllers/errorController";
import AppError from "@src/utils/appError";
import sendResponse from "@src/utils/sendResponse";
const routes = require("./config/Routes") as (app: Express) => void;

process.on("uncaughtException", (error: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...".bgRed.white);
  console.error(`${error.name}: ${error.message}`.bgRed.white);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("UNHANDLED REJECTION! Shutting down...".bgRed.white);
  console.error(String(reason).bgRed.white);
  process.exit(1);
});

const app = express();

// Prints immediately when a request reaches this Express app.
app.use((req, _res, next) => {
  console.log(`REQUEST RECEIVED: ${req.method} ${req.originalUrl}`.bgCyan);
  next();
});

app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use((req, _res, next) => {
  [req.body, req.query, req.params, req.headers].forEach((value) => {
    if (value) mongoSanitize.sanitize(value);
  });
  next();
});

app.use((req, _res, next) => {
  const sanitizeObject = (value: unknown): void => {
    if (!value || typeof value !== "object") return;

    for (const key of Object.keys(value)) {
      const record = value as Record<string, unknown>;
      const item = record[key];
      record[key] = typeof item === "string" ? xssClean(item) : item;
      sanitizeObject(record[key]);
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  sanitizeObject(req.headers);
  next();
});

app.use(hpp({ whitelist: [] }));
app.use(helmet());
app.use(
  "/api",
  rateLimit({
    limit: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  }),
);
routes(app);

app.get("/health", (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    status: "success",
    message: "Hospital backend is running",
    data: null,
  });
});

app.all("/{*splat}", (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

export default app;
