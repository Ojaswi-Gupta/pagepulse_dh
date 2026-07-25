# Page Pulse

> **AI Usage Disclosure:** For this task, I used Gemini to act as a pair programmer. I directed the AI to help me scaffold the Express backend, write the Cheerio parsing logic, and generate the baseline CSS styling based on my design requirements for a glassmorphic UI. I then reviewed, tested, and pushed the final architecture.

A lightweight, robust web tool that instantly audits any URL to check its vital signs. Built as a technical assignment for the **Software Development (SDE)** role at **Digital Heroes**.

---

## 🎯 The Problem

When auditing a webpage for SEO or basic hygiene, developers and marketers often need to run heavy audits (like Lighthouse) or manually inspect the DOM. The prompt required building a tool that:
1. Accepts any URL and returns a JSON report with vital statistics (HTTP status, response time, title, meta description, H1 count, images missing alt text, and word count).
2. Renders this data on a clean frontend.
3. Handles failure gracefully without crashing (invalid URLs, timeouts, non-HTML responses).
4. Is testable, defensible, and can be shipped live on a free tier.

## 💡 The Solution

**Page Pulse** solves this by providing a lightning-fast, monolithic web service. 
Rather than spinning up a heavy headless browser (like Puppeteer) which is notorious for timing out on free hosting tiers, Page Pulse uses native HTTP requests and lightweight DOM parsing. 

The application offers:
*   **Resilience:** It catches bad URLs, handles timeouts gracefully, and correctly identifies non-HTML endpoints (e.g., an image or a JSON API), returning user-friendly error messages instead of server crashes.
*   **Premium Aesthetics:** A vanilla HTML/CSS frontend that feels modern and dynamic, featuring glassmorphism, responsive grids, and subtle micro-animations.
*   **Test Coverage:** Built-in unit tests for the core parsing logic to ensure stability.

## 🏗️ Architecture & Design Decisions

### 1. Monolithic Node.js + Express
I chose to build this as a single Express.js application that serves both the static frontend assets and the backend API endpoint (`/api/audit`). 
*   **Why?** Splitting the app into a separate frontend (e.g., Next.js or React) and backend (e.g., Python/Django) introduces unnecessary complexity for a simple tool and makes deployment on a free tier harder. A monolith ensures that it can be deployed instantly to Render, Vercel, or Railway as a single service.

### 2. Vanilla JS/HTML/CSS Frontend
The frontend uses zero frameworks (no React, Vue, or Tailwind).
*   **Why?** To demonstrate strong fundamental web development skills. Using modern CSS (CSS variables, Grid, Flexbox, backdrop-filter) allows us to achieve a highly premium, animated UI while keeping the bundle size near zero. It loads instantly and remains perfectly semantic.

### 3. Lightweight Parsing (Axios + Cheerio)
Instead of using Puppeteer or Playwright to render the page, the backend uses `axios` to fetch the raw HTML and `cheerio` to parse it.
*   **Why?** Headless browsers require hundreds of megabytes of RAM and are slow to boot, making them unsuitable for free hosting tiers. `cheerio` provides a fast, jQuery-like syntax for traversing raw HTML strings. It allows us to statically analyze SEO tags (`h1`, `title`, `alt` attributes) in a fraction of the time and memory.

---

## 🚀 Setup & Installation

Follow these steps to run the project locally:

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   Git installed.

### 1. Clone the repository
```bash
git clone https://github.com/Ojaswi-Gupta/pagepulse_dh.git
cd pagepulse_dh
```

### 2. Install dependencies
```bash
npm install
```
This installs the required packages: `express`, `axios`, `cheerio`, `cors`, and `jest` (for testing).

### 3. Run the development server
```bash
npm start
```
The server will start, and the application will be accessible at: **[http://localhost:3000](http://localhost:3000)**

### 4. Run the automated tests
```bash
npm test
```
This runs the Jest test suite against the parsing logic, validating the happy path and multiple failure edge cases.

---

## 📡 API Contract

If you want to use the API programmatically, you can hit the endpoint directly.

### `POST /api/audit`

**Request Body (JSON):**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200 OK):**
```json
{
  "status": 200,
  "responseTime": "120ms",
  "title": "Example Domain",
  "metaDescription": "No meta description found",
  "h1Count": 1,
  "imagesMissingAlt": 0,
  "wordCount": 14
}
```

**Error Response (400 or 500):**
```json
{
  "error": "Request timed out"
}
```

---

*Built for the Digital Heroes Internship Qualification Task.*
