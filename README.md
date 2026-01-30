# 🪄 MerchAI Restyler

**MerchAI Restyler** is an AI-powered web application that transforms basic product images into high-quality, marketing-ready visuals using generative AI. It is designed for e-commerce brands, creators, and marketers who want professional product imagery without the cost and complexity of traditional photoshoots.

---

## 🚀 Use Case

### The Problem
Creating high-quality product images typically requires expensive studio setups, professional photographers, and time-consuming manual edits. This barrier makes professional branding inaccessible for:
* **Indie Founders** & Small Brands
* **Dropshippers**
* **Creators** launching fast-to-market products

### The Solution
MerchAI Restyler leverages a **Two-Step AI Pipeline** (Vision + Generation) to allow users to:
1.  Upload a simple product image (e.g., on a plain background).
2.  Apply style instructions (e.g., *"Luxury lifestyle with soft sunlight"*).
3.  Instantly generate photorealistic, marketing-ready assets.

---

## ✨ Key Features

* 🖼️ **Instant Preview:** Real-time image upload and UI feedback.
* 🎨 **Smart Styling:** Preset + custom natural language prompt engineering.
* 🤖 **AI Pipeline:** Hybrid integration of **Gemini Vision** (for product understanding) and **Freepik AI** (for generation).
* 📦 **Cloud Persistence:** Persistent storage via **Supabase** (DB + Storage).
* 🕒 **Generation History:** Session-based history to track and download past results.
* ⚡ **Modern UX:** Smooth transitions and loading states powered by **Zustand**.

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS |
| **State Management** | Zustand |
| **UI Components** | shadcn/ui, Lucide Icons |
| **AI Models** | Google Gemini 2.5 Flash, Freepik AI (Classic Fast) |
| **Backend/DB** | Next.js API Routes, Supabase (PostgreSQL + Storage) |
| **Validation** | Zod (Runtime Schema Validation) |

---

## 📁 Project Structure

This project follows a **Service-Layer Architecture** to ensure the codebase is industry-grade and scalable.

```text
app/
 ├─ page.tsx                  # Declarative page composition
 ├─ api/
 │   └─ generate/route.ts     # Minimalist API entry point
components/
 ├─ image-upload.tsx          # Drag-and-drop & Supabase upload
 ├─ style-selector.tsx        # Prompt construction & state triggers
 ├─ result-view.tsx           # AI output & download actions
 ├─ history-list.tsx          # Paginated/Limited history view
 └─ ui/                        # Atomic shadcn primitives
store/
 └─ generation.store.ts       # Global state (Single Source of Truth)
lib/
 ├─ services/                 # core logic: AIService, StorageService
 ├─ validators/               # Zod schemas for request safety
 ├─ errors/                   # Custom AppError handling
 └─ supabase.ts               # Client initialization
types/
 └─ generation.ts             # Shared TypeScript domain models
```

### ✅ Why This Structure?
* **Separation of Concerns:** Components remain "dumb" (view only), while business logic lives in dedicated services.
* **Predictability:** Zustand ensures state changes are consistent across the app without "prop drilling."
* **Maintainability:** Clear ownership of responsibilities makes it easy to swap the AI provider or DB without touching the UI.

---

### 🔁 Application Flow
1. **Upload:** User selects an image; it is instantly pushed to **Supabase Storage**.
2. **Analyze:** **Gemini Vision** identifies the product (e.g., "A navy blue cotton hoodie").
3. **Generate:** The product description is merged with the user's prompt and sent to **Freepik AI**.
4. **Persist:** The resulting image is stored and indexed in **Supabase PostgreSQL**.
5. **Reactive Update:** Zustand triggers a UI refresh to show the result and update the history.

---

### 🛡️ Validation & Safety
* **Zod Schema Validation:** All API payloads are validated at runtime to prevent malformed requests.
* **Safe Environment Checks:** The application verifies all necessary API keys at startup to avoid silent failures.
* **Error Boundaries:** Graceful handling of AI model timeouts or storage errors.

---

### 🧪 Local Development

**1️⃣ Clone & Install**
```bash
git clone https://github.com/Naman13112004/ai-merch-stylist.git
cd ai-merch-stylist
npm install
```

**2️⃣ Set environment variables**
```bash
GEMINI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
FREEPIK_API_KEY
```

**3️⃣ Run the dev server**
```bash
npm run dev
```

---

### 🔮 Future Improvements
* 🔐 Authentication & user-based history
* 📊 Analytics & usage tracking
* 🧵 Background job queue for generation
* 🖼️ Before/after comparison slider
* 🌍 Internationalization (i18n)
* 🧪 Automated tests (Playwright / RTL)
