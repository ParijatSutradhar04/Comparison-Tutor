# MiniTeach - Size Comparison Demo

A complete demo web application that demonstrates an adaptive teaching assistant for teaching "bigger than / smaller than" concepts to rural Indian village school students.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   # or
   npx vite --port 5173
   ```
   The app will be available at `http://localhost:5173`

3. **Start the mock API server (in a new terminal):**
   ```bash
   npm run server
   ```
   The API will be available at `http://localhost:3001`

## 🎯 Demo Features

### Core Functionality
- **Size-Based Comparisons**: Students learn bigger vs smaller using relevant rural context
- **Adaptive Difficulty**: Automatically adjusts from levels 1-5 based on student performance
- **Dual Modes**: 
  - **Image Mode**: Visual size comparisons with culturally relevant items
  - **Word Mode**: Text-based size comparisons with countdown timer
- **Smart Progression**: Switches to word mode after 3 consecutive correct answers
- **Explanation Overlay**: Shows detailed explanations when students struggle
- **Trilingual Support**: English, Hindi, and Bengali

### Rural Indian Context
- **Village Animals**: Cow vs goat, elephant vs ant, buffalo vs chicken
- **Local Plants**: Banyan tree vs tulsi plant, jackfruit vs guava, rice field vs kitchen garden
- **Village Items**: Village well vs water pot, pucca house vs small hut
- **Traditional Transport**: Bullock cart vs bicycle
- **Natural Elements**: Village pond vs rain puddle, coconut vs date

### Student Onboarding
- Collects student name, class (1-5), language preference (English/Hindi/Bengali), and location
- Data saved to localStorage for session persistence

### Adaptive Engine
- Tracks performance metrics (accuracy, streak, difficulty progression)
- Question selection based on difficulty, class, and location
- Avoids recent question repeats
- Timer-based challenges in word mode (6 seconds default)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Main header with student info
│   ├── OnboardingForm.tsx # Student information collection
│   ├── QuestionCard.tsx # Main question display logic
│   ├── ImagePair.tsx    # Image-based question component
│   ├── WordPair.tsx     # Word-based question component
│   ├── OverlayExplain.tsx # Explanation modal
│   ├── Timer.tsx        # Countdown timer component
│   ├── MetricsPanel.tsx # Performance metrics display
│   └── DemoControls.tsx # Presenter controls
├── hooks/
│   └── useAdaptiveEngine.ts # Core adaptive logic
├── data/
│   └── questions.json   # Sample questions dataset
├── i18n/
│   ├── en.json         # English translations
│   └── hi.json         # Hindi translations
├── utils/
│   └── explain.ts      # LLM explanation simulation
└── App.tsx             # Main application component

server/
└── index.js            # Optional Express API server

public/assets/          # Image assets (see below)
```

## 📊 Dataset Structure

The `src/data/questions.json` contains 15+ sample questions with this structure:

```json
{
  "id": "unique-id",
  "mode": "image" | "word",
  "difficulty": 1-5,
  "class": 1-5,
  "location": ["India", "default"],
  "left": {
    "src": "/assets/image.png",     // for image mode
    "word": "word",                 // for word mode
    "label": "display label",
    "size": "large" | "medium" | "small",
    "sizeValue": 1-10               // numerical comparison value
  },
  "right": { /* same structure */ },
  "explanationSimple": {
    "en": "English explanation",
    "hi": "Hindi explanation",
    "bn": "Bengali explanation"
  }
}
```

## 🖼️ Rural Village Assets

The app includes SVG placeholder assets representing rural Indian village context:

### Created Sample Assets:
```
banyan-tree.png - Large spreading tree
tulsi-plant.png - Small holy basil plant
village-cow.png - Large village cow
village-goat.png - Medium-sized goat
elephant.png - Very large elephant
ant.png - Very small ant (magnified view)
big-mango.png - Large mango fruit
small-lemon.png - Small lemon fruit
```

### Additional Assets Needed:
```
water-buffalo.png, village-chicken.png
banyan-big.png, young-neem.png
jackfruit.png, guava.png
village-well.png, water-pot.png
pucca-house.png, small-hut.png
desert-camel.png, village-rabbit.png
coconut.png, date-fruit.png
bullock-cart.png, village-bicycle.png
village-pond.png, rain-puddle.png
rice-field.png, kitchen-garden.png
```

## 🎮 Demo Controls (for Presentations)

The right panel includes presenter controls:

- **Force Difficulty**: Set specific difficulty level (1-5)
- **Switch to Word Mode**: Skip to word-based questions
- **Reset Progress**: Clear all student progress
- **Run Demo Sequence**: Automated demo showing:
  1. 3 correct image questions (difficulty increases)
  2. Switch to word mode
  3. One correct word question
  4. Timer expiration → explanation overlay

## 🎤 Pitch Talking Points

When demonstrating to stakeholders:

### 1. **Culturally Relevant Learning** (Show rural context questions)
- "Students learn with familiar objects from their village environment"
- "Comparisons use animals, plants, and items they see daily"

### 2. **Size-Based Understanding** (Show image comparisons)
- "Moving from quantity counting to size perception builds spatial reasoning"
- "Concrete size differences prepare students for abstract mathematical concepts"

### 3. **Adaptive Intelligence** (Show metrics panel)
- "Notice how the difficulty automatically adjusts based on student performance"
- "The system tracks understanding and switches modes when ready"

### 4. **Multilingual Support** (Show language options)
- "Students can learn in their native language - Bengali, Hindi, or English"
- "This removes language barriers to mathematical concept learning"

### 5. **Personalized Learning** (Show onboarding)
- "Each student gets questions appropriate for their class and location"
- "Content adapts to their cultural and linguistic background"

### 6. **Engaging Interactions** (Show image/word modes)
- "Visual learners start with images, then graduate to abstract concepts"
- "Timer creates gentle pressure while building confidence"

### 7. **Intelligent Intervention** (Trigger overlay)
- "When students struggle, the AI provides personalized explanations"
- "Real-world assignments connect learning to home experiences"

### 8. **Teacher Insights** (Show metrics)
- "Teachers get real-time insights into student understanding"
- "Data drives instructional decisions for rural classroom needs"

## 🔧 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start mock API server
- `npm run format` - Format code with Prettier

## 🌐 API Endpoints

When running the server (`npm run server`):

- `GET /api/questions` - Fetch questions dataset
- `POST /api/llm-stub/explain` - Generate explanations
- `GET /api/health` - Server health check

## 🚀 Deployment Notes

For production deployment:
1. Build the frontend: `npm run build`
2. Serve the `dist` folder with a web server
3. Optionally deploy the API server for dynamic features
4. Add real image assets to the `public/assets` folder

## 📝 Additions

- Include the name of the image options as well as the word option in hindi and bengali
- Add the actual images
- Refine the bengali and hindi texts.
