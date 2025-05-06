import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyCWVF3PLEdMpPF8k-BHzgNWB81NuwsgVFk";
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get the generative model (Gemini Pro)
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings,
});

// ======== AI Functions ======== 

/**
 * Summarize text using Gemini AI
 */
export async function summarizeText(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    const prompt = `Please summarize the following text concisely while maintaining key points:
    
${text}
    
Provide a structured summary with key points and main concepts.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    if (!response || !response.text()) {
      throw new Error("No response from AI model");
    }

    return response.text();
  } catch (error) {
    console.error("Error summarizing text:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
    throw new Error("Failed to summarize text. Please try again.");
  }
}

/**
 * Generate flashcards from study notes
 */
export async function generateFlashcards(text: string, count: number = 5): Promise<Array<{ question: string, answer: string }>> {
  try {
    const prompt = `Create ${count} flashcards from the following study material:
    
${text}
    
Format each flashcard as a question and answer pair. Focus on key concepts, definitions, and relationships. 
Each flashcard should test understanding, not just memorization.
Format your response as a JSON array of objects with 'question' and 'answer' properties.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Extract the JSON array from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // If JSON parsing fails, create a fallback response
      return Array(count).fill(0).map((_, i) => ({
        question: `Question ${i + 1} about the material`,
        answer: `This would contain the answer to question ${i + 1}.`
      }));
    }

    try {
      const flashcards = JSON.parse(jsonMatch[0]);
      return flashcards.slice(0, count);
    } catch (e) {
      console.error("Error parsing flashcards JSON:", e);
      // Fallback
      return Array(count).fill(0).map((_, i) => ({
        question: `Question ${i + 1} about the material`,
        answer: `This would contain the answer to question ${i + 1}.`
      }));
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
}

/**
 * Check answers to study questions
 */
export async function checkAnswer(question: string, userAnswer: string): Promise<{ 
  isCorrect: boolean;
  feedback: string;
  correctAnswer?: string;
}> {
  try {
    const prompt = `Evaluate this answer to the following question:
    
Question: ${question}

Student's Answer: ${userAnswer}

First, determine if the answer is correct or not. Then, provide detailed feedback on the answer, highlighting strengths and areas for improvement.
If the answer is incorrect or partially correct, provide a correct answer.

Format your response as a JSON object with these properties:
- isCorrect: boolean (true if the answer is correct, false otherwise)
- feedback: string (detailed feedback on the answer)
- correctAnswer: string (only include this if the answer is incorrect or incomplete)`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Extract the JSON object from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback response
      return {
        isCorrect: userAnswer.length > 20,  // Simple fallback
        feedback: "Unable to analyze your answer in detail. Please try again later.",
        correctAnswer: userAnswer.length <= 20 ? "A more complete answer would address the key points of the question." : undefined
      };
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Error parsing answer check JSON:", e);
      // Fallback
      return {
        isCorrect: userAnswer.length > 20,
        feedback: "Your answer shows some understanding of the concept.",
        correctAnswer: userAnswer.length <= 20 ? "A more complete answer would address the key points of the question." : undefined
      };
    }
  } catch (error) {
    console.error("Error checking answer:", error);
    throw error;
  }
}

/**
 * Generate a study plan based on subjects and available time
 */
export async function generateStudyPlan(
  subject: string, 
  duration: string
): Promise<string> {
  try {
    const prompt = `Create a study plan for ${subject} that will take ${duration}. Include specific topics and time allocations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
}

/**
 * Get AI feedback on student work
 */
export async function getAIFeedback(studentWork: string, assignment: string): Promise<string> {
  try {
    const prompt = `As an AI tutor, provide constructive feedback on this student's work.
    
Assignment: ${assignment}

Student's Work:
${studentWork}

Provide detailed, constructive feedback that:
1. Highlights strengths and specific areas for improvement
2. Offers actionable suggestions
3. Is encouraging and supportive
4. Includes specific examples where relevant

Format your feedback in markdown with clear sections.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    throw error;
  }
}

/**
 * Generate questions from study material 
 */
export async function generateQuestions(topic: string, count: number = 3): Promise<Array<{ question: string, answer: string }>> {
  try {
    const prompt = `Create ${count} reflective questions about the topic: ${topic}.
    
These questions should:
1. Encourage deep thinking about the material
2. Help assess understanding of key concepts
3. Prompt application of knowledge to real scenarios
4. Be open-ended and thoughtful

Format your response as a JSON array of objects with 'question' and 'answer' properties.
For the 'answer' property, include placeholder text that indicates what a good answer might include.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Extract the JSON array from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Fallback questions
      return [
        { 
          question: `What are the most important concepts from ${topic}?`, 
          answer: '' 
        },
        { 
          question: `How would you apply ${topic} in a real-world scenario?`, 
          answer: '' 
        },
        { 
          question: `Explain ${topic} in your own words.`, 
          answer: '' 
        }
      ];
    }

    try {
      const questions = JSON.parse(jsonMatch[0]);
      return questions.slice(0, count).map((q: {question: string, answer: string}) => ({...q, answer: ''}));
    } catch (e) {
      console.error("Error parsing questions JSON:", e);
      // Fallback
      return [
        { 
          question: `What are the most important concepts from ${topic}?`, 
          answer: '' 
        },
        { 
          question: `How would you apply ${topic} in a real-world scenario?`, 
          answer: '' 
        },
        { 
          question: `Explain ${topic} in your own words.`, 
          answer: '' 
        }
      ];
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

/**
 * Analyze an image using Gemini Vision
 */
export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    // Use gemini-pro-vision model for image analysis
    const visionModel = genAI.getGenerativeModel({
      model: "gemini-pro-vision",
      safetySettings,
    });

    // Create prompt for image analysis
    const prompt = "Analyze this image in detail. If it's an academic assignment or homework, " +
      "check if the work appears correct. Identify any potential errors or areas for improvement. " +
      "Provide constructive feedback.";

    // Convert base64 string to the format expected by the API
    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };

    // Generate content from the image
    const result = await visionModel.generateContent([prompt, imageData]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

// Export the model for more advanced usage
export { model, genAI };