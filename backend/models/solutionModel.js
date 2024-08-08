const mongoose = require('mongoose');

const solutionSchema = mongoose.Schema(
    {
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Problem',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: true,
        },
        votes: {
            type: Number,
            default: 0,
        },
        voters: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                vote: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
