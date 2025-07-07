import { defineOneEntry } from "oneentry";
import retrieveRefreshToken from "@/actions/auth/retrieveRefreshToken";
import storeRefreshToken from "@/actions/auth/storeRefreshToken";

export async function fetchApiClient() {
  const apiUrl = process.env.ONEENTRY_URL;
  if (!apiUrl) {
    throw new Error("ONEENTRY_URL is missing");
  }

  try {
    const refreshToken = await retrieveRefreshToken();

    const apiClient = defineOneEntry(apiUrl, {
      token: process.env.ONEENTRY_TOKEN,
      langCode: "en_US",
      auth: {
        refreshToken: refreshToken || undefined,
        customAuth: false,
        saveFunction: async (newToken: string) => {
          await storeRefreshToken(newToken);
        },
      },
    });

    return apiClient;
  } catch (error) {
    console.error("Error fetching refresh token:", error);
    throw error;
  }
}
