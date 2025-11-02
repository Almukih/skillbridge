const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
        },
        requirements: [String],
        skills: [String],
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;