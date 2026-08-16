const db = require('../config/db');

// POST /api/feedback - Create new feedback
exports.createFeedback = (req, res) => {
  const { studentName, student_name, courseCode, course_code, rating, comments } = req.body;

  const sName = studentName || student_name;
  const cCode = courseCode || course_code;

  // Validation
  if (!sName || typeof sName !== 'string' || sName.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Student name is required.' 
    });
  }

  if (!cCode || typeof cCode !== 'string' || cCode.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Course code is required.' 
    });
  }

  const numericRating = Number(rating);
  if (rating === undefined || isNaN(numericRating) || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Rating must be an integer between 1 and 5.' 
    });
  }

  const cleanComments = comments ? String(comments).trim() : null;

  const sql = `INSERT INTO feedbacks (student_name, course_code, rating, comments) VALUES (?, ?, ?, ?)`;
  const params = [sName.trim(), cCode.trim().toUpperCase(), numericRating, cleanComments];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting feedback:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to save feedback.' });
    }

    const insertedId = this.lastID;
    db.get(
      `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, created_at AS createdAt FROM feedbacks WHERE id = ?`,
      [insertedId],
      (fetchErr, row) => {
        if (fetchErr) {
          return res.status(201).json({ success: true, message: 'Feedback created successfully', id: insertedId });
        }
        return res.status(201).json({ success: true, message: 'Feedback submitted successfully!', data: row });
      }
    );
  });
};

// GET /api/feedback - Retrieve feedbacks with search, filter, and sorting
exports.getAllFeedback = (req, res) => {
  const { courseCode, course_code, minRating, search, sort } = req.query;
  const filterCourse = courseCode || course_code;

  let sql = `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, created_at AS createdAt FROM feedbacks`;
  const conditions = [];
  const params = [];

  if (filterCourse && filterCourse.trim() !== '' && filterCourse !== 'ALL') {
    conditions.push(`course_code = ?`);
    params.push(filterCourse.trim().toUpperCase());
  }

  if (minRating && !isNaN(Number(minRating))) {
    conditions.push(`rating >= ?`);
    params.push(Number(minRating));
  }

  if (search && search.trim() !== '') {
    conditions.push(`(student_name LIKE ? OR comments LIKE ? OR course_code LIKE ?)`);
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  // Sorting
  if (sort === 'highest_rating') {
    sql += ` ORDER BY rating DESC, created_at DESC`;
  } else if (sort === 'lowest_rating') {
    sql += ` ORDER BY rating ASC, created_at DESC`;
  } else if (sort === 'oldest') {
    sql += ` ORDER BY created_at ASC`;
  } else {
    // Default newest first
    sql += ` ORDER BY created_at DESC`;
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching feedbacks:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to retrieve feedbacks.' });
    }
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  });
};

// GET /api/feedback/:id - Retrieve single feedback by ID
exports.getFeedbackById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, created_at AS createdAt FROM feedbacks WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching feedback by ID:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to retrieve feedback.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }
    return res.status(200).json({ success: true, data: row });
  });
};

// PUT /api/feedback/:id - Update existing feedback
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { studentName, student_name, courseCode, course_code, rating, comments } = req.body;

  db.get(`SELECT * FROM feedbacks WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to verify feedback.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }

    const updatedStudentName = (studentName || student_name) ? String(studentName || student_name).trim() : row.student_name;
    const updatedCourseCode = (courseCode || course_code) ? String(courseCode || course_code).trim().toUpperCase() : row.course_code;
    
    let updatedRating = row.rating;
    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || !Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ success: false, error: 'Validation Error: Rating must be an integer between 1 and 5.' });
      }
      updatedRating = numRating;
    }

    const updatedComments = comments !== undefined ? (comments ? String(comments).trim() : null) : row.comments;

    const updateSql = `UPDATE feedbacks SET student_name = ?, course_code = ?, rating = ?, comments = ? WHERE id = ?`;
    db.run(updateSql, [updatedStudentName, updatedCourseCode, updatedRating, updatedComments, id], function (updateErr) {
      if (updateErr) {
        return res.status(500).json({ success: false, error: 'Database Error: Unable to update feedback.' });
      }

      db.get(
        `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, created_at AS createdAt FROM feedbacks WHERE id = ?`,
        [id],
        (fetchErr, updatedRow) => {
          return res.status(200).json({ success: true, message: 'Feedback updated successfully!', data: updatedRow });
        }
      );
    });
  });
};

// DELETE /api/feedback/:id - Delete feedback by ID
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT id FROM feedbacks WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to verify feedback.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }

    db.run(`DELETE FROM feedbacks WHERE id = ?`, [id], function (deleteErr) {
      if (deleteErr) {
        return res.status(500).json({ success: false, error: 'Database Error: Unable to delete feedback.' });
      }
      return res.status(200).json({ success: true, message: `Feedback with ID ${id} deleted successfully.` });
    });
  });
};

// GET /api/feedback/stats/summary - Calculate aggregate feedback analytics
exports.getFeedbackStats = (req, res) => {
  const overallSql = `SELECT COUNT(*) AS totalFeedback, AVG(rating) AS averageRating FROM feedbacks`;
  const courseSql = `SELECT course_code AS courseCode, COUNT(*) AS feedbackCount, AVG(rating) AS averageRating FROM feedbacks GROUP BY course_code ORDER BY feedbackCount DESC`;
  const ratingDistSql = `SELECT rating, COUNT(*) AS count FROM feedbacks GROUP BY rating`;

  db.get(overallSql, [], (err, overall) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to compute overall stats.' });
    }

    db.all(courseSql, [], (courseErr, courses) => {
      if (courseErr) {
        return res.status(500).json({ success: false, error: 'Database Error: Unable to compute course stats.' });
      }

      db.all(ratingDistSql, [], (distErr, distRows) => {
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (!distErr && distRows) {
          distRows.forEach(r => {
            ratingDistribution[r.rating] = r.count;
          });
        }

        const formattedAverage = overall.averageRating ? parseFloat(overall.averageRating.toFixed(2)) : 0;
        const formattedCourses = (courses || []).map(c => ({
          courseCode: c.courseCode,
          feedbackCount: c.feedbackCount,
          averageRating: c.averageRating ? parseFloat(c.averageRating.toFixed(2)) : 0
        }));

        return res.status(200).json({
          success: true,
          totalFeedback: overall.totalFeedback || 0,
          overallAverageRating: formattedAverage,
          ratingDistribution,
          courseBreakdown: formattedCourses
        });
      });
    });
  });
};
