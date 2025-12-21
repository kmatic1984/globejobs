# Job Aggregator

A modern job search platform built with Next.js, TypeScript, and Tailwind CSS. This application aggregates job listings from various sources and presents them in a clean, user-friendly interface.

## Features

- 🔍 Search and filter job listings
- 🎨 Dark/light mode support
- ⚡ Fast and responsive design
- 📱 Mobile-friendly interface
- 🚀 Built with Next.js for optimal performance

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Caching**: lru-cache

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd job-aggregator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## Scripts

- `dev`: Start development server
- `build`: Build the application for production
- `start`: Start production server
- `lint`: Run ESLint
- `type-check`: Check TypeScript types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
