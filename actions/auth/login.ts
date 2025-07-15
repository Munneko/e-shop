"use server";

import { IAttributes } from "oneentry/dist/base/utils";
import { fetchApiClient } from "../../lib/oneentry";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isErrorWithMessage } from "../../lib/utils";

interface IErroredResponse {
  statusCode: number;
  message: string;
}

export const getLoginFormData = async (): Promise<IAttributes[]> => {
  try {
    const apiClient = await fetchApiClient();
    const response = await apiClient?.Forms.getFormByMarker("sign_in", "en_US");
    console.log("[Login] Form response:", response);
    return response?.attributes as unknown as IAttributes[];
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      console.error("[Login] Fetching form data error:", error.message);
    } else {
      console.error("[Login] Unknown fetching form data error:", error);
    }
    throw new Error("Fetching form data failed.");
  }
};

export const handleLoginSubmit = async (inputValues: {
  email: string;
  password: string;
}) => {
  try {
    const apiClient = await fetchApiClient();

    const data = {
      authData: [
        { marker: "email", value: inputValues.email },
        { marker: "password", value: inputValues.password },
      ],
    };

    const response = await apiClient?.AuthProvider.auth("email", data);

    if (!response?.userIdentifier) {
      const error = response as unknown as IErroredResponse;
      return {
        message: error.message,
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", response.accessToken, {
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refresh_token", response.refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error: unknown) {
    if (isErrorWithMessage(error) && error.statusCode === 401) {
      return { message: error.message };
    }

    console.error("Login error:", error);
    throw new Error("Failed to login. Please try again.");
  }

  redirect("/");
};
