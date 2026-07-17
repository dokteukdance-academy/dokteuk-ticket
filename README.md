# Dokteuk Events

Event reservation system for Dokteuk Dance Academy.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Install dependencies

```bash
cd "/Users/admin/Dokteuk Ticket"
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.

Open [http://localhost:3000/reserve](http://localhost:3000/reserve) for the reservation placeholder.

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout, fonts, metadata
│   ├── page.tsx         # Landing page
│   ├── reserve/page.tsx # Reservation placeholder
│   └── globals.css      # Design tokens and global styles
├── components/
│   ├── HeroSection.tsx
│   ├── EventInfoCard.tsx
│   ├── ReserveTicketButton.tsx
│   └── Footer.tsx
└── lib/
    └── event.ts         # Static event data
```

## Current Scope

- Landing page with hero, event details, and footer
- Static remaining seat count
- Placeholder `/reserve` route (no booking logic yet)
- Firebase integration deferred to a future phase
