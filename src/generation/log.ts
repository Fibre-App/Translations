const reset: string = "\x1b[0m";
const bold: string = "\x1b[1m";
const blueForeground: string = "\x1b[34m";
const greyForeground: string = "\x1b[90m";
const redForeground: string = "\x1b[91m";

const ongoingSections: string[] = [];

function indentation(): string {
  return " ".repeat(ongoingSections.length * 2);
}

export function logSection(name: string): void {
  ongoingSections.push(name);
  console.log(`\n>${indentation().substr(1)}${blueForeground}${bold}${name}${reset}`);
}
export function logDoneSection(): void {
  console.log(`${indentation()}${blueForeground}${bold}Done ${ongoingSections.pop()}${reset}`);
}

export function logInfo(message: string): void {
  console.log(`${indentation()}${greyForeground}${message}${reset}`);
}

export function failWithError(errorMessage: string): never {
  console.log(`${indentation()}${redForeground}${bold}${errorMessage}${reset}`);
  throw new Error(errorMessage);
}
