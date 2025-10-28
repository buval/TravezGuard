// Replit Auth integration - Unauthorized error handling
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}
