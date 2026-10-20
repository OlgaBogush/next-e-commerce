### Prostore

https://next-e-commerce-black-zeta.vercel.app/

A secure e-commerce platform built with React and Next.js. The application focuses on server-side architecture, type-safe database mutations and dynamic session synchronization.

### Core Features

**Full-Stack Architecture:** Built on Next.js 16 (App Router) utilizing Server Actions for secure backend operations.
**Persist Session Cart:** During authorization, the anonymous shopping cart is automatically transferred to the user's profile.
**Security and Authentication:** User authentication via Next-Auth v5 (Credentials Provider) with encrypted password hashing (bcrypt). A built-in route guard layer (Protected Paths) blocks unauthorized access to private pages.
**Data Management:** Relational PostgreSQL (Neon) database managed through Prisma ORM with strict run-time schema validation via Zod.

### Tech Stack

**Frontend:** React 19, Next.js 16, Tailwind CSS, Shadcn UI, Lucide React
**Backend & DB:** Node.js, Prisma ORM, PostgreSQL (Neon Serverless)
**Auth:** Next-Auth v5 (Beta)
