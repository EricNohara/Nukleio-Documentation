# Nukleio Documentation

Documentation site for Nukleio, built with Next.js, Nextra, and MDX.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to view the site.

## Project Structure

- `app/` - Next.js app routes, layout, global styles, and shared components.
- `content/` - MDX documentation pages and Nextra navigation metadata.
- `public/` - Static assets such as fonts, icons, and images.
- `mdx-components.ts` - Shared MDX component overrides used by Nextra.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint for the project.

```bash
npm run lint:fix
```

Runs ESLint and applies automatic fixes where possible.

## Editing Docs

Documentation pages live in `content/` as `.mdx` files. Use `_meta.ts` files to control navigation labels and ordering.
