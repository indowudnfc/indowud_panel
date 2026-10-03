import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";
import { apiFetch } from "./apiClient.js";

export async function getTickets() {
  try {
    const res = await apiFetch(`${BASE_URL}${ENDPOINTS.LOADALLTICKETS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function changeTicketStatus(ticketId, status) {
  try {
    const payload = { ticketId: ticketId, status: status };
    console.log(payload);
    const res = await apiFetch(`${BASE_URL}${ENDPOINTS.CHANGETICKETSTATUS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("User data not found");
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
