# LYRA

LYRA is a music-based social networking application that connects people through their shared music tastes and preferences, enhanced with astrological matching using real-time satellite data. The platform allows users to create profiles, match with others based on both music interests and astrological compatibility, chat, and engage with a broader community of music lovers.

## Features

- **User Authentication**: Secure signup, login, and password reset functionality
- **Profile Creation**: Build personalized profiles highlighting your music preferences and astrological details
- **Music Discovery**: Explore and share your favorite music
- **Dual Matching System**: 
  - Connect with others who share similar music tastes
  - Astrological compatibility matching powered by real-time satellite data
- **Chat**: Communicate with your matches through a built-in messaging system
- **Community**: Engage with the broader LYRA community
- **Responsive Design**: Fully responsive UI that works across devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components
- **Routing**: React Router
- **State Management**: Zustand, React Query
- **Backend Services**: Supabase
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js (v16 or higher)
- npm or Bun package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/findinglyra/LYRA.git
   cd LYRA
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with Bun
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or with Bun
   bun run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Build for Production

```bash
npm run build
# or with Bun
bun run build
```

## Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Database Setup

The application uses Supabase for backend services. The database schema can be found in the `supabase-table-creation.sql` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/findinglyra/LYRA](https://github.com/findinglyra/LYRA)

---

Developed by [Thundastormgod](https://github.com/Thundastormgod)