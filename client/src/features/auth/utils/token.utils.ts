/**
 * Token Management Utility
 *
 * Centralizes read/write operations for authentication tokens.
 * Handles both persistent (localStorage) and session-based (sessionStorage) storage.
 */

const TOKEN_KEY = "token";
const REMEMBER_KEY = "remember";

export const tokenUtils = {
  /**
   * Retrieves the token from either localStorage or sessionStorage.
   */
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Persists the token based on the 'remember' preference.
   */
  setToken: (token: string, remember: boolean = false): void => {
    if (typeof window === "undefined") return;

    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, "true");
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  },

  /**
   * Removes all auth-related identifiers from storage.
   */
  clearToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Checks if the user has opted for persistent login.
   */
  shouldRemember: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(REMEMBER_KEY) === "true";
  },
};
