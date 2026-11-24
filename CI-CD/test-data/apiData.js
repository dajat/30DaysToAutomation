// Base URL for the public demo API
export const API_BASE = 'https://jsonplaceholder.typicode.com';

export const postId = 1;
export const notFoundId = 999999;

// Sample payloads for create/update flows
export const newPost = {
  title: 'Test Post',
  body: 'This is a test post created via API',
  userId: 1,
};

export const updatedPost = {
  id: postId,
  title: 'Updated Test Post',
  body: 'This post has been updated',
  userId: 1,
};
