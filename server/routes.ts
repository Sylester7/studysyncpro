import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { summarizeText } from '../client/src/lib/gemini';
// Added function to generate study plan.  Implementation details are omitted as they are not provided in the prompt.
async function generateStudyPlan(subjects: string[], daysAvailable: number, hoursPerDay: number) {
  //  Implementation for study plan generation would go here.  This is a placeholder.
  return {plan: "A sample study plan"};
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Study planning endpoint
  app.post('/api/study-plan', async (req, res) => {
    try {
      const { subjects, daysAvailable, hoursPerDay } = req.body;
      if (!subjects || !daysAvailable || !hoursPerDay) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const plan = await generateStudyPlan(subjects, daysAvailable, hoursPerDay);
      res.json({ plan });
    } catch (error) {
      console.error('Error generating study plan:', error);
      res.status(500).json({ error: 'Failed to generate study plan' });
    }
  });

  // Note summarization endpoint
  app.post('/api/summarize', async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const summary = await summarizeText(content);
      res.json({ summary });
    } catch (error) {
      console.error('Error summarizing text:', error);
      res.status(500).json({ error: 'Failed to summarize text' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}