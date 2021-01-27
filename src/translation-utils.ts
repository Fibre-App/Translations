export const interpolationRegex: RegExp = /\$\{(.*?)\}/g;

export function interpolate(template: string, args: any): string {
  return template.replace(interpolationRegex, (_, placeholder: string): string => {
    const value: any = args[placeholder];

    if (!value) {
      return placeholder;
    }

    return value.toString();
  });
}
