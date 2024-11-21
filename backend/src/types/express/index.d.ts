import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type as needed (e.g., use a specific User type if available)
    }
  }
}

// Define types for your database results and expected structures
export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    created_at?: Date;
}

export interface JournalEntry {
    id: number;
    title: string;
    content: string;
    user_id: number;
}

export interface DatabaseResults {
    affectedRows: number;
    insertId: number;
}

export interface AuthRequest extends express.Request {
    user?: User; // Optional user property
}