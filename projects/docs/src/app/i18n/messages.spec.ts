import ar from '../../locale/ar.json';
import en from '../../locale/en.json';

function keys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('docs messages', () => {
  it('gives Arabic a value for every English key', () => {
    expect(keys(ar)).toEqual(keys(en));
  });
});
