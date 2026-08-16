const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../feedback.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Connecting to database for extended seeding at:', dbPath);

const extendedSampleFeedbacks = [
  {
    student_name: "Aarav Sharma",
    course_code: "AI402",
    rating: 5,
    category: "Lab Experience",
    tags: ["#HandsOnLab", "#Engaging", "#NeuralNets", "#PyTorch"],
    likes_count: 18,
    instructor_reply: "Thank you Aarav! Excited to see your final generative AI capstone project next week.",
    semester: "Spring 2026",
    comments: "The neural network visualizer and hands-on LLM fine-tuning projects were truly mind-blowing! Outstanding explanations by Professor Roy.",
    created_at: "2026-08-14 10:15:00"
  },
  {
    student_name: "Priya Patel",
    course_code: "CS101",
    rating: 5,
    category: "Lecture Quality",
    tags: ["#ClearLectures", "#GreatFeedback", "#DSA", "#Algorithms"],
    likes_count: 24,
    instructor_reply: "Great work mastering binary search trees early in the semester!",
    semester: "Spring 2026",
    comments: "Crystal clear concepts in Data Structures and Algorithms. The live coding sessions and discord office hours helped me ace technical interviews.",
    created_at: "2026-08-14 14:30:00"
  },
  {
    student_name: "Rohan Mehta",
    course_code: "WEB301",
    rating: 4,
    category: "Course Material",
    tags: ["#Fullstack", "#HandsOnLab", "#React", "#NodeJS"],
    likes_count: 12,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "Loved building fullstack React & Express apps! Would love a couple more lectures dedicated to Kubernetes, Docker and microservices deployment.",
    created_at: "2026-08-15 09:45:00"
  },
  {
    student_name: "Ananya Iyer",
    course_code: "UX102",
    rating: 5,
    category: "Lab Experience",
    tags: ["#DesignSystems", "#Engaging", "#FigmaMastery", "#Accessibility"],
    likes_count: 31,
    instructor_reply: "Your accessibility-focused mobile prototype was one of the best submissions in class.",
    semester: "Spring 2026",
    comments: "Figma workshops, design systems, and user empathy micro-sessions made this course my absolute favorite this semester! Highly recommended.",
    created_at: "2026-08-15 11:20:00"
  },
  {
    student_name: "Vikram Malhotra",
    course_code: "DS200",
    rating: 4,
    category: "Course Material",
    tags: ["#DataScience", "#Python", "#ClearLectures", "#Statistics"],
    likes_count: 9,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "Very comprehensive coverage of statistical models, clean EDA, and pandas. Interactive Jupyter notebooks in labs were top notch.",
    created_at: "2026-08-15 13:00:00"
  },
  {
    student_name: "Zoya Khan",
    course_code: "CYBER204",
    rating: 5,
    category: "Lab Experience",
    tags: ["#CTF", "#HandsOnLab", "#CyberSec", "#EthicalHacking"],
    likes_count: 22,
    instructor_reply: "Kudos on winning the simulated CTF challenge round!",
    semester: "Spring 2026",
    comments: "Hands down the best ethical hacking and penetration testing lab. The simulated capture-the-flag challenge was intense and educational!",
    created_at: "2026-08-15 15:40:00"
  },
  {
    student_name: "Liam O'Connor",
    course_code: "CLOUD305",
    rating: 5,
    category: "Lab Experience",
    tags: ["#AWS", "#Serverless", "#HandsOnLab", "#CloudArchitecture"],
    likes_count: 15,
    instructor_reply: "Awesome work orchestrating the multi-region DynamoDB pipeline.",
    semester: "Spring 2026",
    comments: "Building real-world serverless microservices on AWS Lambda with Terraform was super practical. The lab credits provided were super generous.",
    created_at: "2026-08-15 17:15:00"
  },
  {
    student_name: "Sophia Chen",
    course_code: "AI402",
    rating: 5,
    category: "Lecture Quality",
    tags: ["#AI", "#ClearLectures", "#ComputerVision"],
    likes_count: 17,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "The visual breakdown of Transformer Attention layers and Diffusion models made advanced math feel intuitive. Professor answered all Discord questions within hours.",
    created_at: "2026-08-15 19:30:00"
  },
  {
    student_name: "Marcus Aurelius Vance",
    course_code: "CS101",
    rating: 4,
    category: "Grading & Exams",
    tags: ["#ToughExams", "#DSA", "#FastGrading"],
    likes_count: 14,
    instructor_reply: "Feedback noted on midterm time limits; we will adjust the final exam buffer.",
    semester: "Spring 2026",
    comments: "The midterm was quite tough and time-constrained, but the TA grading feedback was remarkably thorough and rapid. Learned a ton from my mistakes.",
    created_at: "2026-08-16 08:10:00"
  },
  {
    student_name: "Fatima Al-Sayed",
    course_code: "WEB301",
    rating: 5,
    category: "Lab Experience",
    tags: ["#TypeScript", "#NextJS", "#HandsOnLab", "#GreatFeedback"],
    likes_count: 26,
    instructor_reply: "Loved your fullstack portfolio app, Fatima!",
    semester: "Spring 2026",
    comments: "Fullstack TypeScript, TailwindCSS, and Next.js App Router live coding labs were directly applicable to real software engineering jobs.",
    created_at: "2026-08-16 09:00:00"
  },
  {
    student_name: "Devon Miller",
    course_code: "QUANTUM101",
    rating: 5,
    category: "Lecture Quality",
    tags: ["#Quantum", "#Qiskit", "#Engaging", "#MindBlowing"],
    likes_count: 20,
    instructor_reply: "Quantum entanglement is tricky, but you picked up qubit superposition very fast.",
    semester: "Spring 2026",
    comments: "Writing IBM Qiskit code that ran on actual superconducting quantum hardware in the cloud blew my mind! A must-take elective.",
    created_at: "2026-08-16 10:25:00"
  },
  {
    student_name: "Elena Rostova",
    course_code: "DS200",
    rating: 5,
    category: "Course Material",
    tags: ["#MachineLearning", "#Kaggle", "#HandsOnLab"],
    likes_count: 13,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "The mini-Kaggle competition at the end of the term was exhilarating. Great balance between theoretical statistics and practical Scikit-learn.",
    created_at: "2026-08-16 11:45:00"
  },
  {
    student_name: "Jordan Taylor",
    course_code: "UX102",
    rating: 4,
    category: "Grading & Exams",
    tags: ["#Critique", "#UserTesting", "#FastGrading"],
    likes_count: 8,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "Peer review critique sessions were insightful. I would suggest giving students 1 extra week for the final portfolio prototype submission.",
    created_at: "2026-08-16 12:15:00"
  },
  {
    student_name: "Karan Johar",
    course_code: "CYBER204",
    rating: 4,
    category: "Course Material",
    tags: ["#NetworkSecurity", "#Wireshark", "#ClearLectures"],
    likes_count: 10,
    instructor_reply: null,
    semester: "Spring 2026",
    comments: "Wireshark packet analysis assignments were super engaging. Would love more focus on zero-trust architectures and cloud IAM security.",
    created_at: "2026-08-16 13:05:00"
  },
  {
    student_name: "Naomi Osaka",
    course_code: "CLOUD305",
    rating: 5,
    category: "Lecture Quality",
    tags: ["#Kubernetes", "#DevOps", "#CI_CD", "#ClearLectures"],
    likes_count: 28,
    instructor_reply: "DevOps pipelines make modern tech companies tick. Great engagement in discussions!",
    semester: "Spring 2026",
    comments: "Best explanation of Kubernetes pods, ingress controllers, and GitHub Actions CI/CD pipelines I have ever experienced. 10/10!",
    created_at: "2026-08-16 13:50:00"
  }
];

db.serialize(() => {
  // Clear table first for clean extended seed
  db.run(`DELETE FROM feedbacks`, (err) => {
    if (err) console.error('Error clearing feedbacks:', err.message);

    const stmt = db.prepare(`
      INSERT INTO feedbacks (student_name, course_code, rating, comments, category, tags, likes_count, instructor_reply, semester, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    extendedSampleFeedbacks.forEach(f => {
      stmt.run([
        f.student_name,
        f.course_code,
        f.rating,
        f.comments,
        f.category,
        JSON.stringify(f.tags),
        f.likes_count,
        f.instructor_reply,
        f.semester,
        f.created_at
      ]);
    });

    stmt.finalize(() => {
      console.log(`✨ Successfully seeded ${extendedSampleFeedbacks.length} rich feedbacks into database!`);
      db.close();
    });
  });
});
