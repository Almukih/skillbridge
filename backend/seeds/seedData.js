const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@skillbridge.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create employer
        const employer = await User.create({
            name: 'Tech Company',
            email: 'employer@tech.com',
            password: 'employer123',
            role: 'employer',
            profile: {
                company: 'Tech Solutions Inc',
                bio: 'Leading technology company'
            }
        });

        // Create job seeker
        const jobSeeker = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'jobseeker123',
            role: 'jobSeeker',
            profile: {
                bio: 'Recent graduate looking for opportunities',
                skills: ['JavaScript', 'React', 'Node.js'],
                education: 'BS Computer Science'
            }
        });

        // Create sample jobs
        const jobs = await Job.create([
            {
                title: 'Frontend Developer',
                description: 'We are looking for a skilled Frontend Developer...',
                company: 'Tech Solutions Inc',
                location: 'Remote',
                type: 'Full-time',
                category: 'Technology',
                salary: '$60,000 - $80,000',
                requirements: ['2+ years React experience', 'JavaScript proficiency'],
                skills: ['React', 'JavaScript', 'CSS'],
                employer: employer._id
            },
            {
                title: 'Marketing Intern',
                description: 'Great opportunity for marketing students...',
                company: 'Tech Solutions Inc',
                location: 'New York, NY',
                type: 'Internship',
                category: 'Marketing',
                salary: '$20 - $25/hour',
                requirements: ['Marketing knowledge', 'Social media skills'],
                skills: ['Marketing', 'Social Media', 'Communication'],
                employer: employer._id
            }
        ]);

        // Create sample application
        await Application.create({
            job: jobs[0]._id,
            applicant: jobSeeker._id,
            coverLetter: 'I am very interested in this position and believe my skills are a great match...',
            status: 'pending'
        });

        console.log('Sample data created successfully!');
        console.log('Admin: admin@skillbridge.com / admin123');
        console.log('Employer: employer@tech.com / employer123');
        console.log('Job Seeker: john@example.com / jobseeker123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();