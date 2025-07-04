# Instagram Clone API

## Overview
This project is a backend API for an Instagram-like application. It is built using Node.js, Express, MongoDB (Mongoose), and integrates Cloudinary for media uploads. The API supports user authentication, post creation, commenting, and more.

## Features
- **Authentication**: JWT-based login and registration.
- **User Management**: Create, update, follow/unfollow users.
- **Post Management**: Create, retrieve, like/unlike posts.
- **Comment Management**: Add and retrieve comments for posts.
- **File Uploads**: Media uploads using Multer and Cloudinary.
- **Error Handling**: Centralized error handling with `ApiError`.
- **Rate Limiting**: Prevent abuse with `express-rate-limit`.
- **CORS**: Secure cross-origin requests.
- **Swagger Documentation**: API documentation available at `/api-docs`.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Igclone_api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   DB_URI=mongodb://127.0.0.1:27017/igclone
   ```

## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. Access the API documentation at:
   ```
   http://localhost:3000/api-docs
   ```

## Project Structure
```
Igclone_api/
├── src/
│   ├── app.js                # Entry point of the application
│   ├── api/
│   │   ├── routes.js         # Main API routes
│   │   ├── user/             # User-related logic
│   │   ├── post/             # Post-related logic
│   │   ├── comment/          # Comment-related logic
│   ├── config/               # Configuration files (Cloudinary, logger, etc.)
│   ├── db/                   # Database connection (Mongoose)
│   ├── middleware/           # Middleware (auth, validation, etc.)
│   ├── models/               # Mongoose models (User, Post, Comment)
│   ├── routers/              # Express routers
│   ├── utils/                # Utility functions (error handling, response formatting)
├── uploads/                  # Temporary file uploads
├── .env                      # Environment variables
├── package.json              # Project metadata and dependencies
├── README.md                 # Project documentation
```

## API Endpoints
### User
- `POST /login`: Login a user.
- `POST /registerStep1`: Register a user (Step 1).
- `POST /registerCredentials`: Register user credentials.
- `POST /registerInfo`: Register user information.
- `GET /getUsers`: Retrieve all users.
- `GET /getUsersByIds`: Retrieve users by IDs.
- `POST /follow`: Follow a user.
- `POST /unfollow`: Unfollow a user.

### Post
- `POST /createPost`: Create a new post.
- `GET /getPosts`: Retrieve posts with pagination.
- `POST /like`: Like a post.
- `POST /unlike`: Unlike a post.

### Comment
- `POST /comment`: Add a comment to a post.
- `GET /comments/:id`: Retrieve comments for a post.

## Testing
Automated tests can be added using Jest and Supertest. Example test for `/login`:
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('POST /login', () => {
  it('should return 200 and a token for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'password123' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});
```

## License
This project is licensed under the MIT License.
