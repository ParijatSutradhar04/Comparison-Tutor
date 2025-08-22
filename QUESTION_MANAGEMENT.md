# Question Management Guide

## Overview

The questions in this app are now clearly separated into two categories:

1. **Image-based questions** - Selected randomly based on difficulty and other factors
2. **Word-based questions** - Asked in sequential order as defined in the data file

## File Structure

### 📁 `src/data/`
- `imageQuestions.json` - Contains all image-based comparison questions (random selection)
- `wordQuestions.json` - Contains all word-based comparison questions (**sequential order**)

The original `questions.json` file has been removed to maintain a clean architecture.

## How Word Questions Work

### Sequential Order
Word questions are asked in the **exact order** they appear in the `wordQuestions.json` file. The system:

1. Sorts questions first by difficulty level (1-5)
2. Then by question ID for consistent ordering
3. Presents them one by one in this predetermined sequence
4. Loops back to the beginning after reaching the end

### Current Word Questions (in order):
1. **camel vs rabbit** (difficulty 2)
2. **coconut vs date** (difficulty 3)  
3. **bullock cart vs bicycle** (difficulty 4)
4. **village pond vs rain puddle** (difficulty 5)
5. **rice field vs kitchen garden** (difficulty 5)

## 🎯 Where to Modify Word Questions

### To change existing word questions:
**Edit:** `src/data/wordQuestions.json`

### To add new word questions:
**Add to:** `src/data/wordQuestions.json`

### To change the order of word questions:
**Reorder entries in:** `src/data/wordQuestions.json`

## Structure of a Word Question

```json
{
  "id": "word-your-question-name",
  "mode": "word-mode",
  "difficulty": 3,
  "class": 3,
  "location": ["India", "default"],
  "left": {
    "word": "larger item",
    "label": "larger item",
    "size": "",
    "sizeValue": 8,
    "image": "/assets/images/larger_item.jpg"
  },
  "right": {
    "word": "smaller item", 
    "label": "smaller item",
    "size": "",
    "sizeValue": 3,
    "image": "/assets/images/smaller_item.jpg"
  },
  "explanationSimple": {
    "en": "English explanation for kids",
    "hi": "Hindi explanation in Devanagari script", 
    "bn": "Bengali explanation in Bengali script"
  }
}
```

### Key Fields to Modify:

- **`word`**: The text that appears in word mode
- **`label`**: Display label (usually same as word)
- **`sizeValue`**: Numerical size (1-10 scale, higher = bigger)
- **`image`**: Path to the corresponding image
- **`explanationSimple`**: Kid-friendly explanations in 3 languages

### Important Notes:

1. **sizeValue determines correctness**: Higher sizeValue = correct answer for "which is bigger"
2. **Difficulty levels**: 1 (easiest) to 5 (hardest)
3. **Sequential order**: Questions appear in the exact order listed in the JSON file
4. **Images must exist**: Make sure corresponding image files exist in `/public/assets/images/`

## Image Questions

Image questions work differently - they are selected **randomly** based on:
- Current difficulty level
- Student class
- Location preferences
- Recently asked questions (to avoid repetition)

**Edit image questions in:** `src/data/imageQuestions.json`

## Testing Changes

After modifying questions:

1. Save the JSON file
2. Run `npm run build` to check for syntax errors
3. Test in the browser to verify questions appear correctly

## Technical Implementation

The sequential word question logic is implemented in:
- `src/hooks/useAdaptiveEngine.ts` (main logic)
- Questions are sorted and served in order using `wordModeQuestionIndex`
- Index resets when switching between modes or restarting the app
