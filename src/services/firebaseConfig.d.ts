declare module '*.js' {
  const value: any;
  export default value;
}

declare module './src/services/firebaseConfig' {
  export const auth: any;
  export const db: any;
  const app: any;
  export default app;
}
