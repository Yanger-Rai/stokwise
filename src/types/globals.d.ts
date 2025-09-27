/**
 * Global Type Declaration for CSS Imports
 * * This file tells TypeScript to recognize and allow imports of
 * CSS files (like './globals.css') that don't export any values.
 * This resolves the TS2882 error: "Cannot find module or type declarations."
 */

declare module "*.css" {
  // Since './globals.css' is a side-effect import (it runs for its effect,
  // not for an exported value), we can declare it as a module without
  // specifying an export. TypeScript will now permit the import.
}

// If you also use CSS Modules (e.g., import styles from './Component.module.css'),
// you may want to uncomment and include this declaration as well:

/*
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
*/
