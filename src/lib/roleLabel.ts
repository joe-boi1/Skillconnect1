export function roleLabel(role: "CUSTOMER" | "ARTISAN" | "ADMIN") {
  if (role === "CUSTOMER") return "Customer";
  if (role === "ARTISAN") return "Service provider";
  return "Administrator";
}
