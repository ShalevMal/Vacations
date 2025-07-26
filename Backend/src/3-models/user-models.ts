import mongoose from "mongoose";

export enum UserRole {
  User = "User",
  Admin = "Admin",
}

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "Missing first name"],
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: [true, "Missing last name"],
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "Missing email"],
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  },
  password: {
    type: String,
    required: [true, "Missing password"],
    minlength: 4,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.User,
  },
}, {
  versionKey: false,
  timestamps: true,
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
