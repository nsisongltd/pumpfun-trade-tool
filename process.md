# to build this i did this


so, i will use this place to discuss my thought process on the project. 

first i installed pnpm. i am not a js fan but i can code any language i need to. i started coding in lisp then in c before i learnt to write html, erlang and php. now, i just learn anything i want to do.

back to this project, i installed pnpm

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh - && source /root/.bashrc
```

by the way, i will use nextjs for this project too, so i will install all the dependencies i need at once. i wrote all this in my jotter, but i want to implement it since i did it months ago (in november) during my degen moves but my telegram channel is banned now.

```bash
pnpm add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-base @solana/wallet-adapter-wallets @project-serum/serum @project-serum/anchor @tanstack/react-query @trpc/client @trpc/server @trpc/react-query @prisma/client @tremor/react decimal.js trading-vue-js zod ws @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react && pnpm add -D prisma @types/ws
```

### besides, these are the things i installed:
Next.js 14 with App Router
TypeScript 5.x
TanStack Query (React Query) for data management
Prisma for database (for user data, trade history)
Redis for real-time price caching
WebSocket for real-time updates
TailwindCSS + Shadcn/ui for modern UI
Jest + React Testing Library for testing
OpenTelemetry for monitoring
Docker for containerization

### for now, these are the things i want to achieve, once i achieve that, i can add more futures.

Real-time price tracking across multiple DEXs
Trading integration with major Solana DEXs
Portfolio tracking and management
Trade execution with slippage protection
Advanced charting with TradingView integration
Price alerts and notifications
Historical data analysis
Risk management tools
Performance analytics
Performance Optimizations:
Edge runtime deployment
Aggressive caching strategies
Optimized bundle size
Dynamic imports for code splitting
Service Worker for offline capabilities
WebSocket connection pooling

### although my brother suggested that i did some performance Optimizations, especially:
Edge runtime deployment
Aggressive caching strategies
Optimized bundle size
Dynamic imports for code splitting
Service Worker for offline capabilities
WebSocket connection pooling