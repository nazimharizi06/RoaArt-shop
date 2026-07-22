const test = require('node:test');
const assert = require('node:assert/strict');
const { buildArtworkPayload } = require('./artworkPayload');

test('buildArtworkPayload maps form values to Supabase fields', () => {
  const payload = buildArtworkPayload({
    title: 'Night Study',
    description: 'A new piece',
    price: '220',
    medium: 'Oil on canvas',
    width: '24',
    height: '36',
    category: 'Abstract',
    availability: false,
    featured: true,
    quantity: '2',
  });

  assert.deepEqual(payload, {
    title: 'Night Study',
    description: 'A new piece',
    price: 220,
    medium: 'Oil on canvas',
    category: 'Abstract',
    quantity: 2,
    is_available: false,
    featured: true,
  });
});
