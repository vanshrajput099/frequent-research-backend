import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    profession: {
        type: String,
        enum: ["student", "developer", "entrepreneur"],
        required: true
    },
    companyName: {
        type: String,
        required: function () {
            return this.profession === "entrepreneur";
        }
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    subscription: {
        type: String,
        enum: ["basic", "pro", "enterprise"],
        required: true
    },
    newsletter: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 15);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};