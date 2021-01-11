const reset: string = "\x1b[0m";
const bold: string = "\x1b[1m";
const blueForeground: string = "\x1b[34m";
const greyForeground: string = "\x1b[90m";
const redForeground: string = "\x1b[91m";

export function logSection(name: string): void {
  console.log(`\n> ${blueForeground}${bold}${name}${reset}`);
}
export function logDoneSection(name: string): void {
  console.log(`  ${blueForeground}${bold}Done ${name}${reset}`);
}

export function logInfo(message: string): void {
  console.log(`  ${greyForeground}${message}${reset}`);
}

export function logError(error: string): void {
  console.log(`  ${redForeground}${bold}${error}${reset}`);
  throw new Error(error);
}
