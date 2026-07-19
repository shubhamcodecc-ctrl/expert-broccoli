import request from 'supertest';
import app from '../../src/index';
import { connectDatabase, disconnectDatabase } from '../../src/config/database';
import User from '../../src/models/User';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config';

describe('User Endpoints', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    const user = await User.create({
      email: 'testuser@example.com',
      password: 'password123',
      name: 'Test User',
    });
    userId = user._id.toString();
    token = jwt.sign(
      { userId: user._id, email: user.email },
      config.JWT_SECRET as string
    );
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('testuser@example.com');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/preferences', () => {
    it('should get user preferences', async () => {
      const response = await request(app)
        .get('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('categories');
    });
  });

  describe('PUT /api/users/preferences', () => {
    it('should update user preferences', async () => {
      const response = await request(app)
        .put('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          categories: ['Technology', 'Gaming'],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categories).toContain('Technology');
    });
  });
});
