/** Files imported `with { loader: 'text' }` arrive as their source text. */
declare module '*.css' {
  const text: string;
  export default text;
}
