const db = require('../config/db');

// Helper to safely parse tags
function parseTags(tagsInput) {
  if (Array.isArray(tagsInput)) {
    return JSON.stringify(tagsInput.map(t => String(t).trim()));
  }
  if (typeof tagsInput === 'string') {
    try {
      const parsed = JSON.parse(tagsInput);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch {
      // Split by comma or hashtag
      const splitTags = tagsInput.split(/[\s,]+/).filter(t => t.length > 0).map(t => t.startsWith('#') ? t : `#${t}`);
      return JSON.stringify(splitTags);
    }
  }
  return JSON.stringify([]);
}

// POST /api/feedback - Create new feedback
exports.createFeedback = (req, res) => {
  const { studentName, student_name, courseCode, course_code, rating, comments, category, tags, semester } = req.body;

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
  const cleanCategory = category ? String(category).trim() : 'General';
  const cleanTags = parseTags(tags);
  const cleanSemester = semester ? String(semester).trim() : 'Spring 2026';

  const sql = `INSERT INTO feedbacks (student_name, course_code, rating, comments, category, tags, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [sName.trim(), cCode.trim().toUpperCase(), numericRating, cleanComments, cleanCategory, cleanTags, cleanSemester];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting feedback:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to save feedback.' });
    }

    const insertedId = this.lastID;
    db.get(
      `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, category, tags, likes_count AS likesCount, instructor_reply AS instructorReply, semester, created_at AS createdAt FROM feedbacks WHERE id = ?`,
      [insertedId],
      (fetchErr, row) => {
        if (fetchErr) {
          return res.status(201).json({ success: true, message: 'Feedback created successfully', id: insertedId });
        }
        if (row && typeof row.tags === 'string') {
          try { row.tags = JSON.parse(row.tags); } catch { row.tags = []; }
        }
        return res.status(201).json({ success: true, message: 'Feedback submitted successfully!', data: row });
      }
    );
  });
};

// GET /api/feedback - Retrieve feedbacks with search, category, tag, filter, and sorting
exports.getAllFeedback = (req, res) => {
  const { courseCode, course_code, category, tag, minRating, search, sort, page, limit } = req.query;
  const filterCourse = courseCode || course_code;

  let sql = `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, category, tags, likes_count AS likesCount, instructor_reply AS instructorReply, semester, created_at AS createdAt FROM feedbacks`;
  const conditions = [];
  const params = [];

  if (filterCourse && filterCourse.trim() !== '' && filterCourse !== 'ALL') {
    conditions.push(`course_code = ?`);
    params.push(filterCourse.trim().toUpperCase());
  }

  if (category && category.trim() !== '' && category !== 'ALL') {
    conditions.push(`category = ?`);
    params.push(category.trim());
  }

  if (tag && tag.trim() !== '') {
    conditions.push(`tags LIKE ?`);
    params.push(`%${tag.trim()}%`);
  }

  if (minRating && !isNaN(Number(minRating))) {
    conditions.push(`rating >= ?`);
    params.push(Number(minRating));
  }

  if (search && search.trim() !== '') {
    conditions.push(`(student_name LIKE ? OR comments LIKE ? OR course_code LIKE ? OR tags LIKE ? OR category LIKE ?)`);
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  // Sorting
  if (sort === 'highest_rating') {
    sql += ` ORDER BY rating DESC, created_at DESC`;
  } else if (sort === 'lowest_rating') {
    sql += ` ORDER BY rating ASC, created_at DESC`;
  } else if (sort === 'most_liked') {
    sql += ` ORDER BY likes_count DESC, created_at DESC`;
  } else if (sort === 'oldest') {
    sql += ` ORDER BY created_at ASC`;
  } else {
    // Default newest first
    sql += ` ORDER BY created_at DESC`;
  }

  // Pagination support
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  if (!isNaN(pageNum) && !isNaN(limitNum) && pageNum > 0 && limitNum > 0) {
    const offset = (pageNum - 1) * limitNum;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching feedbacks:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to retrieve feedbacks.' });
    }

    const formattedRows = (rows || []).map(row => {
      let parsedTags = [];
      if (typeof row.tags === 'string') {
        try { parsedTags = JSON.parse(row.tags); } catch { parsedTags = []; }
      } else if (Array.isArray(row.tags)) {
        parsedTags = row.tags;
      }
      return {
        ...row,
        tags: parsedTags,
        likesCount: row.likesCount || 0
      };
    });

    return res.status(200).json({ 
      success: true, 
      count: formattedRows.length, 
      page: pageNum || 1,
      data: formattedRows 
    });
  });
};

// GET /api/feedback/:id - Retrieve single feedback by ID
exports.getFeedbackById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, category, tags, likes_count AS likesCount, instructor_reply AS instructorReply, semester, created_at AS createdAt FROM feedbacks WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching feedback by ID:', err.message);
      return res.status(500).json({ success: false, error: 'Database Error: Unable to retrieve feedback.' });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }
    if (typeof row.tags === 'string') {
      try { row.tags = JSON.parse(row.tags); } catch { row.tags = []; }
    }
    return res.status(200).json({ success: true, data: row });
  });
};

// PUT /api/feedback/:id - Update existing feedback
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { studentName, student_name, courseCode, course_code, rating, comments, category, tags, semester } = req.body;

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
    const updatedCategory = category !== undefined ? String(category).trim() : (row.category || 'General');
    const updatedTags = tags !== undefined ? parseTags(tags) : (row.tags || '[]');
    const updatedSemester = semester !== undefined ? String(semester).trim() : (row.semester || 'Spring 2026');

    const updateSql = `UPDATE feedbacks SET student_name = ?, course_code = ?, rating = ?, comments = ?, category = ?, tags = ?, semester = ? WHERE id = ?`;
    db.run(updateSql, [updatedStudentName, updatedCourseCode, updatedRating, updatedComments, updatedCategory, updatedTags, updatedSemester, id], function (updateErr) {
      if (updateErr) {
        return res.status(500).json({ success: false, error: 'Database Error: Unable to update feedback.' });
      }

      db.get(
        `SELECT id, student_name AS studentName, course_code AS courseCode, rating, comments, category, tags, likes_count AS likesCount, instructor_reply AS instructorReply, semester, created_at AS createdAt FROM feedbacks WHERE id = ?`,
        [id],
        (fetchErr, updatedRow) => {
          if (updatedRow && typeof updatedRow.tags === 'string') {
            try { updatedRow.tags = JSON.parse(updatedRow.tags); } catch { updatedRow.tags = []; }
          }
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

// POST /api/feedback/:id/like - Helpful / Upvote Reaction
exports.likeFeedback = (req, res) => {
  const { id } = req.params;

  db.run(`UPDATE feedbacks SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to register reaction.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }

    db.get(`SELECT id, likes_count AS likesCount FROM feedbacks WHERE id = ?`, [id], (fetchErr, row) => {
      return res.status(200).json({ 
        success: true, 
        message: 'Helpful reaction recorded!', 
        likesCount: row ? row.likesCount : 1 
      });
    });
  });
};

// POST /api/feedback/:id/reply - Instructor Reply
exports.replyFeedback = (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || typeof reply !== 'string' || reply.trim() === '') {
    return res.status(400).json({ success: false, error: 'Reply text is required.' });
  }

  db.run(`UPDATE feedbacks SET instructor_reply = ? WHERE id = ?`, [reply.trim(), id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to post reply.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: `Feedback with ID ${id} not found.` });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Instructor reply published successfully!', 
      instructorReply: reply.trim() 
    });
  });
};

// GET /api/feedback/stats/summary - Calculate aggregate feedback analytics
exports.getFeedbackStats = (req, res) => {
  const overallSql = `SELECT COUNT(*) AS totalFeedback, AVG(rating) AS averageRating, SUM(COALESCE(likes_count, 0)) AS totalReactions FROM feedbacks`;
  const courseSql = `SELECT course_code AS courseCode, COUNT(*) AS feedbackCount, AVG(rating) AS averageRating FROM feedbacks GROUP BY course_code ORDER BY feedbackCount DESC`;
  const ratingDistSql = `SELECT rating, COUNT(*) AS count FROM feedbacks GROUP BY rating`;
  const categorySql = `SELECT COALESCE(category, 'General') AS category, COUNT(*) AS count, AVG(rating) AS avgRating FROM feedbacks GROUP BY category`;

  db.get(overallSql, [], (err, overall) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to compute overall stats.' });
    }

    db.all(courseSql, [], (courseErr, courses) => {
      if (courseErr) {
        return res.status(500).json({ success: false, error: 'Database Error: Unable to compute course stats.' });
      }

      db.all(ratingDistSql, [], (distErr, distRows) => {
        db.all(categorySql, [], (catErr, categoryRows) => {
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

          const formattedCategories = (categoryRows || []).map(cat => ({
            category: cat.category,
            count: cat.count,
            averageRating: cat.avgRating ? parseFloat(cat.avgRating.toFixed(2)) : 0
          }));

          // Calculate sentiment index (% 4 & 5 stars vs total)
          const totalPositive = (ratingDistribution[4] || 0) + (ratingDistribution[5] || 0);
          const totalCount = overall.totalFeedback || 0;
          const sentimentScore = totalCount > 0 ? Math.round((totalPositive / totalCount) * 100) : 100;

          return res.status(200).json({
            success: true,
            totalFeedback: totalCount,
            overallAverageRating: formattedAverage,
            totalReactions: overall.totalReactions || 0,
            sentimentScore: sentimentScore,
            ratingDistribution,
            courseBreakdown: formattedCourses,
            categoryBreakdown: formattedCategories
          });
        });
      });
    });
  });
};

// GET /api/feedback/export/csv - Export CSV stream
exports.exportCsv = (req, res) => {
  const sql = `SELECT id, student_name, course_code, rating, category, tags, likes_count, comments, semester, created_at FROM feedbacks ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to export CSV.' });
    }

    const headers = ['ID', 'Student Name', 'Course Code', 'Rating', 'Category', 'Tags', 'Helpful Upvotes', 'Comments', 'Semester', 'Created At'];
    const csvLines = [headers.join(',')];

    (rows || []).forEach(r => {
      let tagsStr = '';
      try {
        const parsed = JSON.parse(r.tags);
        tagsStr = Array.isArray(parsed) ? parsed.join(' ') : r.tags;
      } catch {
        tagsStr = r.tags || '';
      }

      const escapedComment = `"${(r.comments || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const escapedTags = `"${tagsStr.replace(/"/g, '""')}"`;
      const row = [
        r.id,
        `"${(r.student_name || '').replace(/"/g, '""')}"`,
        `"${r.course_code || ''}"`,
        r.rating,
        `"${(r.category || 'General').replace(/"/g, '""')}"`,
        escapedTags,
        r.likes_count || 0,
        escapedComment,
        `"${r.semester || 'Spring 2026'}"`,
        `"${r.created_at || ''}"`
      ];
      csvLines.push(row.join(','));
    });

    const csvContent = csvLines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="voxora_feedback_report_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvContent);
  });
};

// GET /api/feedback/export/json - Export complete JSON file
exports.exportJson = (req, res) => {
  const sql = `SELECT id, student_name AS studentName, course_code AS courseCode, rating, category, tags, likes_count AS likesCount, comments, instructor_reply AS instructorReply, semester, created_at AS createdAt FROM feedbacks ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database Error: Unable to export JSON.' });
    }

    const data = (rows || []).map(r => {
      let parsedTags = [];
      try { parsedTags = JSON.parse(r.tags); } catch { parsedTags = []; }
      return { ...r, tags: parsedTags };
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="voxora_feedback_data_${new Date().toISOString().slice(0, 10)}.json"`);
    return res.status(200).json({
      platform: 'Voxora Quantum Feedback Platform',
      exportDate: new Date().toISOString(),
      count: data.length,
      feedbacks: data
    });
  });
};

// GET /api/health - Telemetry & System Health
exports.getHealth = (req, res) => {
  db.get(`SELECT COUNT(*) AS total FROM feedbacks`, (err, row) => {
    const isDbConnected = !err && row !== undefined;
    return res.status(200).json({
      status: 'healthy',
      version: '3.0.0-QUANTUM',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        engine: 'SQLite3',
        connected: isDbConnected,
        recordCount: row ? row.total : 0
      },
      memory: process.memoryUsage()
    });
  });
};
