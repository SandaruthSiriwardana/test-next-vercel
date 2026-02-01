// Minimal module declaration so TypeScript won't error when building
// without the @types/nodemailer / @types/uuid packages installed.
declare module 'nodemailer' {
  const nodemailer: any
  export default nodemailer
}

declare module 'uuid' {
  export function v4(): string
}
