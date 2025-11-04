🚀 SkillBridge - Youth Job & Training Platform

https://skillbridge-8x4wzvub4-alfreds-projects-5bcbfc40.vercel.app/

A modern, full-stack web application connecting young job seekers with employers and training opportunities. SkillBridge helps bridge the gap between youth talent and career opportunities.

🌟 Live Demo
Frontend: https://vercel.com/alfreds-projects-5bcbfc40/skillbridge/5dNcHpSLtrq3Q1f6vAnejPtaacSZ

Backend API: [https://skillbridge-pm9q.onrender.com](https://dashboard.render.com/web/srv-d43oi69r0fns73fbhle0/deploys/dep-d44rgd8dl3ps73bikc30)

✨ Features
👥 Multi-Role System
Job Seekers - Browse jobs, apply with cover letters, track applications

Employers - Post job listings, manage applications, update status

Admins - Full system oversight, user management, analytics

💼 Job Management
Advanced job search and filtering

Job categories and types (Full-time, Part-time, Internship, Contract)

Salary information and requirements

Company profiles and details

🔐 Authentication & Security
JWT-based authentication

Password encryption with bcrypt

Protected routes and role-based access

Secure API endpoints

📱 Modern UI/UX
Fully responsive design (mobile-first)

Clean, professional interface

Real-time notifications

Interactive dashboard

🛠️ Tech Stack
Frontend
React.js - UI framework

React Router - Client-side routing

Axios - HTTP client

CSS3 - Styling with mobile-first approach

Context API - State management

Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - Database

Mongoose - ODM

JWT - Authentication

bcryptjs - Password hashing

CORS - Cross-origin requests

Deployment
Vercel - Frontend hosting

Render - Backend hosting

MongoDB Atlas - Cloud database

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

MongoDB (local or Atlas account)

Installation
Clone the repository

bash
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge
Backend Setup

bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
Frontend Setup

bash
cd frontend
npm install
npm start
Seed Sample Data

bash
cd backend
node seeds/seedData.js
Environment Variables
Backend (.env)

env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_jwt_secret_here
Frontend (.env)

env
REACT_APP_API_URL=http://localhost:5000
👤 Default Accounts
After seeding, use these credentials:

Role	Email	Password	Access
Job Seeker	john@example.com	jobseeker123	Browse and apply for jobs


📁 Project Structure
text
skillbridge/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth & validation
│   ├── seeds/           # Sample data
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Route components
│       ├── context/     # React context
│       └── api/         # API configuration
└── README.md



🎯 API Endpoints
Authentication
POST /api/users/register - User registration

POST /api/users/login - User login

GET /api/users/profile - Get user profile

PUT /api/users/profile - Update profile

Jobs
GET /api/jobs - Get all jobs (with filters)

GET /api/jobs/:id - Get single job

POST /api/jobs - Create job (employer/admin)

PUT /api/jobs/:id - Update job

DELETE /api/jobs/:id - Delete job

Applications
POST /api/applications - Apply for job

GET /api/applications/my-applications - User's applications

GET /api/applications/employer - Employer's received applications

PUT /api/applications/:id/status - Update application status

🚀 Deployment
Frontend (Vercel)
Push code to GitHub

Connect repository to Vercel

Set environment variables

Deploy automatically

Backend (Render)
Connect GitHub repository

Set build command: npm install

Set start command: npm start

Configure environment variables

Database (MongoDB Atlas)
Create free cluster

Get connection string

Configure network access

Create database user

🧪 Testing
bash
# Test backend API
curl https://your-backend.onrender.com/health

# Test frontend
npm test
🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Development Team
Alfred - Full Stack Developer
Mohammed - Full Stack Developer

🙏 Acknowledgments
PLP June 2025 Cohort 

React.js community

MongoDB Atlas for free tier

Vercel & Render for hosting

All contributors and testers

📞 Support
For support, email support@skillbridge.com or create an issue in the repository.

Built with ❤️ for youth employment opportunities

Report Bug · Request Feature

</div>
