# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router with TypeScript and Tailwind CSS v4.

- `app/` - App Router pages and layouts
- `app/layout.tsx` - Root layout with Geist fonts
- `app/page.tsx` - Home page
- `@/*` path alias maps to project root
