import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Create a simple Express-like request/response wrapper for tRPC
const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Create a mock Express app just for tRPC middleware
  const middleware = createExpressMiddleware({
    router: appRouter,
    createContext,
  });

  // Call the middleware with the Vercel request/response
  return middleware(req as any, res as any);
};

export default handler;
