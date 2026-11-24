import { test as base, expect } from '@playwright/test';
import { JsonPlaceholderClient } from '../../pages/api/JsonPlaceholderClient.js';
import { API_BASE, newPost, notFoundId, postId, updatedPost } from '../../test-data/apiData.js';

const test = base.extend({
  api: async ({ request }, use) => {
    await use(new JsonPlaceholderClient(request, API_BASE));
  },
});

test.describe('JSONPlaceholder posts', () => {
  test('lists posts', async ({ api }) => {
    const posts = await api.listPosts();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('gets an existing post', async ({ api }) => {
    const response = await api.getPost(postId);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      id: postId,
      title: expect.stringMatching(/\S/),
    });
  });

  // JSONPlaceholder simulates writes. Each check verifies its own response.
  test('returns the simulated creation response', async ({ api }) => {
    const response = await api.createPost(newPost);

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ ...newPost, id: expect.any(Number) });
  });

  test('returns the simulated update response', async ({ api }) => {
    const response = await api.updatePost(postId, updatedPost);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(updatedPost);
  });

  test('accepts a simulated deletion', async ({ api }) => {
    const response = await api.deletePost(postId);

    expect(response.status()).toBe(200);
  });

  test('returns 404 for a missing post', async ({ api }) => {
    const response = await api.getPost(notFoundId);

    expect(response.status()).toBe(404);
  });
});

test('lists users with contact information', async ({ api }) => {
  const users = await api.listUsers();

  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);
  for (const user of users) {
    expect(user).toMatchObject({
      id: expect.any(Number),
      name: expect.stringMatching(/\S/),
      email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      address: { city: expect.stringMatching(/\S/) },
    });
  }
});
