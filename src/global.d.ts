// TypeScript 6.0+: Side-effect imports require type declarations
declare module "*.css";
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
