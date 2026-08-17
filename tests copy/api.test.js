const request = require('supertest');
const app = require('../src/app');

describe('⚡ VOXORA QUANTUM REST API TEST SUITE', () => {

  // 1. Health & Telemetry Test
  test('GET /api/health should return system status healthy and database telemetry', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('3.0.0-QUANTUM');
    expect(res.body.database.connected).toBe(true);
    expect(typeof res.body.uptime).toBe('number');
  });

  // 2. Feedbacks Retrieval
  test('GET /api/feedback should return array of feedbacks with tags and likes', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data[0].tags)).toBe(true);
  });

  // 3. Filtering & Search
  test('GET /api/feedback?courseCode=AI402 should return only AI402 reviews', async () => {
    const res = await request(app).get('/api/feedback?courseCode=AI402');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach(item => {
      expect(item.courseCode).toBe('AI402');
    });
  });

  // 4. Analytics Summary
  test('GET /api/feedback/stats/summary should return aggregate statistics and distributions', async () => {
    const res = await request(app).get('/api/feedback/stats/summary');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalFeedback).toBeGreaterThan(0);
    expect(res.body.overallAverageRating).toBeGreaterThanOrEqual(1);
    expect(res.body.overallAverageRating).toBeLessThanOrEqual(5);
    expect(res.body.ratingDistribution).toBeDefined();
    expect(Array.isArray(res.body.courseBreakdown)).toBe(true);
  });

  // 5. Validation Error on Invalid Rating
  test('POST /api/feedback with invalid rating should return 400 Validation Error', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        studentName: "Test Student",
        courseCode: "CS999",
        rating: 10 // Invalid (> 5)
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Rating must be an integer between 1 and 5');
  });

  // 6. Validation Error on Missing Name
  test('POST /api/feedback with missing name should return 400', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        courseCode: "CS999",
        rating: 5
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  // 7. Successful Feedback Creation
  let createdFeedbackId = null;
  test('POST /api/feedback should create new feedback with category and tags', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        studentName: "Automated Jest Runner",
        courseCode: "TEST101",
        rating: 5,
        category: "Lab Experience",
        tags: ["#AutomatedTest", "#Jest", "#Supertest"],
        comments: "Automated test review created successfully."
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.studentName).toBe("Automated Jest Runner");
    expect(res.body.data.courseCode).toBe("TEST101");
    createdFeedbackId = res.body.data.id;
  });

  // 8. Upvote / Like
  test('POST /api/feedback/:id/like should increment likes count', async () => {
    const res = await request(app).post(`/api/feedback/${createdFeedbackId}/like`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.likesCount).toBeGreaterThanOrEqual(1);
  });

  // 9. Faculty Reply
  test('POST /api/feedback/:id/reply should save instructor reply', async () => {
    const res = await request(app)
      .post(`/api/feedback/${createdFeedbackId}/reply`)
      .send({ reply: "Automated instructor response verified." });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.instructorReply).toBe("Automated instructor response verified.");
  });

  // 10. CSV Export
  test('GET /api/feedback/export/csv should return CSV content with headers', async () => {
    const res = await request(app).get('/api/feedback/export/csv');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('ID,Student Name,Course Code,Rating,Category,Tags');
  });

  // 11. JSON Export
  test('GET /api/feedback/export/json should return full JSON dataset', async () => {
    const res = await request(app).get('/api/feedback/export/json');
    expect(res.statusCode).toEqual(200);
    expect(res.body.platform).toBe('Voxora Quantum Feedback Platform');
    expect(Array.isArray(res.body.feedbacks)).toBe(true);
  });

  // Clean up created test feedback
  afterAll(async () => {
    if (createdFeedbackId) {
      await request(app).delete(`/api/feedback/${createdFeedbackId}`);
    }
  });
});
