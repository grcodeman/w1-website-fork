# W1 Startup Community

Website for the W1 Startup Community at Western Michigan University. Built with Next.js, Tailwind CSS, and deployed on Vercel.

**Live site:** [w1build.com](https://www.w1build.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app
  page.tsx              # Landing page (hero + 3 pillar cards)
  learn/page.tsx        # Learning resources
  ecosystem/page.tsx    # Midwest startup org directory
  portfolio/page.tsx    # Startups built by W1 members
  components/           # Shared UI components

/data
  bronco-build-it.ts         # Weekly session schedule (sessions generated from it)
  ecosystem.json              # City/org directory data
  portfolio.json              # Portfolio startup entries
  resources.json              # Learning resources
```

Adding a new ecosystem org, portfolio startup, session link, or learning resource is just a data file edit.
