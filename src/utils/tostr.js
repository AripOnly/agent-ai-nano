export function toStr(value) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}
