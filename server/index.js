import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve image questions data
app.get('/api/imageQuestions', (req, res) => {
  try {
    const questionsPath = path.join(__dirname, '../src/data/imageQuestions.json');
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    res.json(questions);
  } catch (error) {
    console.error('Error loading image questions:', error);
    res.status(500).json({ error: 'Failed to load image questions' });
  }
});

// Serve word questions data
app.get('/api/wordQuestions', (req, res) => {
  try {
    const questionsPath = path.join(__dirname, '../src/data/wordQuestions.json');
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    res.json(questions);
  } catch (error) {
    console.error('Error loading word questions:', error);
    res.status(500).json({ error: 'Failed to load word questions' });
  }
});

// Legacy endpoint for backward compatibility (serves combined data)
app.get('/api/questions', (req, res) => {
  try {
    const imageQuestionsPath = path.join(__dirname, '../src/data/imageQuestions.json');
    const wordQuestionsPath = path.join(__dirname, '../src/data/wordQuestions.json');
    const imageQuestions = JSON.parse(fs.readFileSync(imageQuestionsPath, 'utf8'));
    const wordQuestions = JSON.parse(fs.readFileSync(wordQuestionsPath, 'utf8'));
    const combined = [...imageQuestions, ...wordQuestions];
    res.json(combined);
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// LLM stub endpoint
app.post('/api/llm-stub/explain', (req, res) => {
  const { question, language = 'en' } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question data required' });
  }

  // Simulate LLM processing delay
  setTimeout(() => {
    const leftCount = question.left.count;
    const rightCount = question.right.count;
    const leftLabel = question.left.label || question.left.word || 'items';
    const rightLabel = question.right.label || question.right.word || 'items';

    let explanation;
    if (language === 'hi') {
      if (leftCount > rightCount) {
        explanation = `बाएं में ${leftCount} ${leftLabel} हैं, दाएं में ${rightCount}। ${leftCount}, ${rightCount} से बड़ा है।`;
      } else {
        explanation = `दाएं में ${rightCount} ${rightLabel} हैं, बाएं में ${leftCount}। ${rightCount}, ${leftCount} से बड़ा है।`;
      }
    } else {
      // English
      if (leftCount > rightCount) {
        explanation = `Left has ${leftCount} ${leftLabel}, right has ${rightCount}. ${leftCount} is greater than ${rightCount}.`;
      } else {
        explanation = `Right has ${rightCount} ${rightLabel}, left has ${leftCount}. ${rightCount} is greater than ${leftCount}.`;
      }
    }

    res.json({ 
      explanation,
      assignment: language === 'hi' 
        ? 'अब आप कोशिश करें: घर में वस्तुओं को गिनें और तुलना करें!'
        : 'Now you try: count objects at home and compare them!'
    });
  }, 800); // Simulate API delay
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MiniTeach API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MiniTeach API server running on http://localhost:${PORT}`);
  console.log(`📊 Image Questions endpoint: http://localhost:${PORT}/api/imageQuestions`);
  console.log(`📝 Word Questions endpoint: http://localhost:${PORT}/api/wordQuestions`);
  console.log(`📋 All Questions endpoint: http://localhost:${PORT}/api/questions`);
  console.log(`🧠 LLM stub endpoint: http://localhost:${PORT}/api/llm-stub/explain`);
});
