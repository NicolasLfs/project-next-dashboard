import { OAuth2Client } from "google-auth-library";

// utils/googleAdsApi.ts (ou um arquivo utilitário similar)

const clientId = process.env.AUTH_GOOGLE_ID || "";
const clientSecret = process.env.AUTH_GOOGLE_SECRET || "";
const redirectUri = "http://localhost:3000/profile";

export const oauth2Client = new OAuth2Client(
  clientId,
  clientSecret,
  redirectUri
);
