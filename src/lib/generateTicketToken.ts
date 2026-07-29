export function generateTicketToken(): string {
    return crypto.randomUUID().replace(/-/g, "");
  }