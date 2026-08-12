declare module "xss-clean" {
  import type { RequestHandler } from "express";

  const xss: () => RequestHandler;
  export default xss;
}

declare module "xss-clean/lib/xss" {
  export const clean: (value: string) => string;
}

declare global {
  interface String {
    bgRed: string;
    bgGreen: string;
    bgYellow: string;
    bgBlue: string;
    bgMagenta: string;
    bgCyan: string;
    bgWhite: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    bold: string;
    italic: string;
    reset: string;
  }
}
