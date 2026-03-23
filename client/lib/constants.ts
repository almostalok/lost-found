export const ITEM_CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "keys", label: "Keys" },
  { value: "wallet", label: "Wallet" },
  { value: "clothing", label: "Clothing" },
  { value: "jewelry", label: "Jewelry" },
  { value: "bags", label: "Bags & Luggage" },
  { value: "other", label: "Other" },
] as const;

export const ITEM_STATUSES = [
  { value: "LOST", label: "Lost", color: "red" },
  { value: "FOUND", label: "Found", color: "green" },
  { value: "CLAIMED", label: "Claimed", color: "yellow" },
  { value: "RETURNED", label: "Returned", color: "blue" },
] as const;

export const APP_NAME = "Lost & Found";
