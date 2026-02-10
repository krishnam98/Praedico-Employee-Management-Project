import mongoose from "mongoose";

const taskSubmissionSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            default: "Submitted",
        },
        attachment: { type: String },
        rejectionReason: { type: String },
        submittedId: { type: String, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model("TaskSubmission", taskSubmissionSchema);
