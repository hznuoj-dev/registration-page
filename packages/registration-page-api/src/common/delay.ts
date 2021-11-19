export const DELAY_FOR_SECURITY = 200;

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
