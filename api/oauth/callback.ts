import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../../server/db";
import { getSessionCookieOptions } from "../../server/_core/cookies";
import { sdk } from "../../server/_core/sdk";

function getQueryParam(req: VercelRequest, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const code = getQueryParam(req, "code");
  const state = getQueryParam(req, "state");

  if (!code || !state) {
    return res.status(400).json({ error: "code and state are required" });
  }

  try {
    const tokenResponse = await sdk.exchangeCodeForToken(code, state);
    const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

    if (!userInfo.openId) {
      return res.status(400).json({ error: "openId missing from user info" });
    }

    await db.upsertUser({
      openId: userInfo.openId,
      name: userInfo.name || null,
      email: userInfo.email ?? null,
      loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(userInfo.openId, {
      name: userInfo.name || "",
      expiresInMs: ONE_YEAR_MS,
    });

    // Set cookie manually in Vercel
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${sessionToken}; Path=/; Max-Age=${ONE_YEAR_MS / 1000}; HttpOnly; Secure; SameSite=Lax`
    );

    res.redirect(302, "/");
  } catch (error) {
    console.error("[OAuth] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}
