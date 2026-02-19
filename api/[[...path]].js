/**
 * Vercel Serverless: forwards all /api/* requests to Express app
 * This allows buildCommand + outputDirectory to work without builds array conflict
 */
import app from '../backend/server.js';

export default app;
