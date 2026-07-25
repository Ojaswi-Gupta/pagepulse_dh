# Page Pulse

A web tool that audits any URL and provides a JSON report with vital signs like response time, page title, H1 counts, missing alt texts, and word counts. Built for the Digital Heroes SDE Task.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <YOUR-REPO-URL>
   cd <YOUR-REPO-NAME>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.

4. **Run tests:**
   ```bash
   npm test
   ```

## API Contract

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
  "error": "Invalid URL format"
}
```

## Design Decisions

1. **Monolithic Node.js + Express Architecture:**
   * **Reasoning:** Instead of splitting the frontend and backend into two separate services (e.g., Next.js frontend + Python backend), I chose a single Express app that serves static files and the API. This significantly simplifies deployment (can be shipped to Render, Vercel, or Railway as one package) and keeps the project lightweight and cohesive.

2. **Vanilla JS/HTML/CSS over Frameworks:**
   * **Reasoning:** The frontend uses zero frameworks to avoid unnecessary build steps and dependencies. The UI was built with modern Vanilla CSS (custom properties, flexbox/grid, animations, glassmorphism) to achieve a premium aesthetic with maximum performance and flexibility. This guarantees the app is fast and the code is semantic and easy to audit.

3. **Using Cheerio for HTML Parsing:**
   * **Reasoning:** Rather than using a headless browser (like Puppeteer) to evaluate the page, I used `axios` for fetching and `cheerio` for parsing. Headless browsers are very heavy, slow, and expensive to host. Cheerio provides a fast, jQuery-like syntax for parsing raw HTML, which is perfect for statically analyzing SEO tags (`h1`, `title`, `alt` attributes) in a fraction of the time.
