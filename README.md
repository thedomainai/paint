# Paint - AI Image Generation Tool

A web-based tool for building structured image generation prompts using Google's Gemini API.

## Features

- **Structured Prompt Builder**: Build detailed image prompts with meta settings, global context, composition, and objects
- **Reference Image Support**: Upload reference images for visual guidance
- **Real-time Preview**: Generate images directly in the browser
- **Image History**: Track and manage previously generated images
- **Modern UI**: Clean, responsive interface with brand gradient styling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **AI**: Google Gemini 2.0 Flash
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/thedomainai/paint.git
cd paint

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey)) | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thedomainai/paint&env=GEMINI_API_KEY)

## Project Structure

```
paint/
├── app/                    # Next.js App Router
│   ├── api/generate/       # Image generation API
│   └── page.tsx            # Main page
├── components/ui/          # shadcn/ui components
├── features/
│   └── prompt-builder/     # Prompt builder feature
│       ├── components/     # UI components
│       │   └── ui/         # Shared form components
│       ├── hooks/          # React hooks
│       └── types/          # TypeScript types
└── lib/
    ├── gemini.ts           # Gemini API client
    ├── services/           # Business logic services
    └── prompt/             # Prompt defaults
```

## License

MIT
