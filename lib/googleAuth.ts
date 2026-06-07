import { googleAuthUrl } from "./authApi";
import { api } from "./api";
import { sanitizeInternalPath } from "./authRules";

const authOrigin = new URL(api.users).origin;

export const openGoogleAuthPopup = (nextPath = "/") =>
  new Promise<{ success: boolean; nextPath: string; message?: string }>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Sign-In can only start in the browser"));
      return;
    }

    const features = [
      "popup=yes",
      "width=520",
      "height=680",
      `left=${Math.max(window.screenX + window.outerWidth / 2 - 260, 0)}`,
      `top=${Math.max(window.screenY + window.outerHeight / 2 - 340, 0)}`,
    ].join(",");

    const safeNextPath = sanitizeInternalPath(nextPath, "/");
    const popup = window.open(googleAuthUrl(safeNextPath), "alaira-google-auth", features);

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups and try again."));
      return;
    }

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearInterval(watcher);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== authOrigin) {
        return;
      }

      if (event.data?.type !== "vastraaura:auth") {
        return;
      }

      cleanup();
      popup.close();

      if (event.data.payload?.success) {
        resolve(event.data.payload);
        return;
      }

      reject(new Error(event.data.payload?.message || "Authentication failed"));
    };

    const watcher = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Authentication window closed before completion"));
      }
    }, 400);

    window.addEventListener("message", handleMessage);
    popup.focus();
  });