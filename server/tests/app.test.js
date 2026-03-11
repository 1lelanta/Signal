import { describe, it, expect } from 'vitest';
import app from '../src/app.js';

describe('Server app basic checks', () => {
  it('exports an express app', () => {
    expect(app).toBeDefined();
    // express apps have a `use` function
    expect(typeof app.use).toBe('function');
  });

  it('mounts critical routes', () => {
    const stack = app._router && app._router.stack ? app._router.stack : [];
    const mounted = stack
      .map((layer) => layer.regexp && layer.regexp.source)
      .filter(Boolean)
      .join('\n');

    // check for admin and reports mounts
    expect(mounted.includes('api\\/admin')).toBe(true);
    expect(mounted.includes('api\\/reports')).toBe(true);
  });
});
