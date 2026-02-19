import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';
import fs from 'fs';
import OpenAI from 'openai';
import axios from 'axios';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Vercel serverless: use /tmp (writable), local: use uploads/
const uploadsDir = process.env.VERCEL ? join(os.tmpdir(), 'food-analyzer-uploads') : join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Nutritionix API configuration
const NUTRITIONIX_API_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_APP_KEY;

/**
 * Analyze food image using GPT-4 Vision
 */
async function analyzeFoodImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and provide detailed information in JSON format. Include:
- food_name: The name of the food in English (e.g., "bibimbap", "pizza")
- estimated_weight_grams: Estimated weight in grams
- estimated_portions: Number of servings/portions
- description: Brief description of the dish
- ingredients: List of main ingredients you can identify

Be as accurate as possible. Return ONLY valid JSON without any markdown formatting or code blocks.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    
    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.replace(/```json\n/g, '').replace(/```/g, '').trim();
    } else if (content.includes('```')) {
      jsonContent = content.replace(/```\n/g, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error analyzing food image with GPT:', error);
    throw new Error('Failed to analyze food image: ' + error.message);
  }
}

/**
 * Get nutrition information from Nutritionix API
 */
async function getNutritionInfo(foodName, servingSize = 1) {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        query: `${servingSize} serving of ${foodName}`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_API_ID,
          'x-app-key': NUTRITIONIX_API_KEY
        }
      }
    );

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      return {
        food_name: food.food_name,
        calories: Math.round(food.nf_calories),
        protein: Math.round(food.nf_protein * 10) / 10,
        carbs: Math.round(food.nf_total_carbohydrate * 10) / 10,
        fat: Math.round(food.nf_total_fat * 10) / 10,
        serving_weight_grams: Math.round(food.serving_weight_grams),
        serving_unit: food.serving_unit,
        photo: food.photo?.thumb || null
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching nutrition info from Nutritionix:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Estimate nutrition using GPT as fallback
 */
async function estimateNutritionWithGPT(foodName, weightGrams) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Estimate the nutrition information for ${weightGrams}g of ${foodName}. 
Provide a JSON response with:
- calories (kcal)
- protein (g)
- carbs (g)
- fat (g)

Be as accurate as possible based on typical nutrition values. Return ONLY valid JSON.`
        }
      ],
      max_tokens: 200
    });

    const content = response.choices[0].message.content;
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.replace(/```json\n/g, '').replace(/```/g, '').trim();
    } else if (content.includes('```')) {
      jsonContent = content.replace(/```\n/g, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error estimating nutrition with GPT:', error);
    return null;
  }
}

// API Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * Main food analysis endpoint
 */
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    filePath = req.file.path;

    // Step 1: Analyze image with GPT-4 Vision
    console.log('Analyzing image with GPT-4 Vision...');
    const foodAnalysis = await analyzeFoodImage(filePath);
    console.log('GPT Analysis:', foodAnalysis);

    // Step 2: Get nutrition info from Nutritionix
    console.log('Fetching nutrition info from Nutritionix...');
    let nutritionInfo = await getNutritionInfo(foodAnalysis.food_name, foodAnalysis.estimated_portions);

    // Step 3: If Nutritionix fails, use GPT as fallback
    if (!nutritionInfo) {
      console.log('Nutritionix failed, using GPT estimation...');
      nutritionInfo = await estimateNutritionWithGPT(
        foodAnalysis.food_name,
        foodAnalysis.estimated_weight_grams
      );
    }

    // Combine results
    const result = {
      success: true,
      analysis: {
        food_name: foodAnalysis.food_name,
        description: foodAnalysis.description,
        ingredients: foodAnalysis.ingredients,
        estimated_weight_grams: foodAnalysis.estimated_weight_grams,
        estimated_portions: foodAnalysis.estimated_portions
      },
      nutrition: nutritionInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        note: 'Nutrition information not available'
      }
    };

    res.json(result);

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    
    // Clean up uploaded file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to analyze food image',
      message: error.message
    });
  }
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Export for Vercel serverless
export default app;

// Start server only when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Food Analyzer Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  Warning: OPENAI_API_KEY not configured');
    }
    if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_APP_KEY) {
      console.warn('⚠️  Warning: Nutritionix API credentials not configured');
    }
  });
}

