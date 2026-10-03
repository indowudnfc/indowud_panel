import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";
import { apiFetch } from "./apiClient.js";

/** `filters` = { from?, to? } ISO timestamps on generation date; filtering runs on the server across all pages. */
export const getAllQRData = async (token, page, filters = {}) => {
  try {
    const response = await apiFetch(`${BASE_URL}${ENDPOINTS.GETALLQRDATA}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ page, ...(filters.from || filters.to ? { ...filters, dateField: "createdAt" } : {}) }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch QR data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching QR data:", error);
    throw error;
  }
};

export async function searchQRByBatch(query) {
  try {
    const res = await apiFetch(`${BASE_URL}${ENDPOINTS.SEARCHQRBYBATCH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error("QR search failed");
    return res.json();
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
}
