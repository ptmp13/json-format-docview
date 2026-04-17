export async function plugin() {
  const { FieldFormatsJsonPlugin } = await import('./plugin');
  return new FieldFormatsJsonPlugin();
}
