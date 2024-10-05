import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

// Define the base URL of your API
const BASE_URL = 'http://localhost:3000'; // Change to your server's URL

export const options = {
    vus: 1000, // Number of virtual users (can be increased or adjusted)
    iterations: 100000, // Total number of iterations (1 lakh)
    maxDuration: '8m', // Max duration for the test
};

export default function () {
  // Generate random post data
  const payload = JSON.stringify({
    title: `Post Title 2`,
    content: `Post content 2`,
  });

  // Define the request headers
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send POST request to the /create-post endpoint
  const res = http.post(`${BASE_URL}/create-post`, payload, params);

  // Check if the response status is 201 (Created)
  check(res, {
    'is status 201': (r) => r.status === 201,
    'content is present': (r) => JSON.parse(r.body).message === 'Post created',
  });

  // Simulate wait time between requests
  sleep(1);
}