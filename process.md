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


anyways, i have created all the directories i need:
```bash
mkdir -p src/{components,features/{tracking,trading,portfolio},core,lib,types} && touch src/types/index.ts src/lib/utils.ts src/core/constants.ts
```

then, i had to setup the core types in index.ts, and then the core constants in constants.ts. now, i have setup the utility functions in utils.ts

all good now, no error yet. let me setup prisma schema for the db. ```pnpm prisma init``` 
oh shit, let me just install glohbally o, this has got me an error. ```pnpm add -g prisma && pnpm prisma init```

still waiting for it to load sef. it should do, let me write down the prisma schema i intend to work with on my notepad to brainstorm while it does the rubbish.

okay, i have setup the prisma schema file in schema.prisma, let me now create the first react component for the trading interface. atleast the market selector would be easy to do since i just have to import a few things i like on marketselector.tsx, now i am trying to structure the order form component without errors too in orderform.tsx. seriously, finance is tough, i just have to make an orderbook too so it can match it against the form. okay, let me write the orderbook.tsx. give me some minutes.

okay, i am back. time to create the working trading page to get the whole components together, i did this mistake before, let me try now again. fuck this mehn, too many errors.... pages.tsx mehn!

okay, it is working finally....let me create the solana wallet provider wrapper for this project in providers.tsx. i have some in mind, so let me list it. be right back

okay, let me update the root layout to use the providers i suggested. layout.tsx time to get sucked. dasssssshhh, another error ke! finally, e don dey work!

let me create a small api route to get solana market data, na doings gan gan go start there. omooor route.ts abi routes.ts, what should i name it?

okay, route.ts then. let me just make all directories to have src/app/api/markets, then i put route.ts there. okay done!

let me create a hook to fetch and manage the market data i just got right now. omooor useMarkets.ts or make ah name am useMarketData.ts? okay, useMarkets.ts then.

I should just go and code this on live youtube then, or what do you think?

So I need to even manage the order book data, i created an orderbook before, let me manage the data that it contains itself on useOrderBook.ts. I think we'd just name stuffs as we think it instead of bothering then.

```bash
af9b4454-81e3-41fc-8598-92ce8f84d31e
request id
```

okay, i think i should just create the order book api endpoint then. route.ts....fuck i am hungry. okay, one more before i eat. let me create a web socket server for real time market data handling first in websocket.ts.

by the way, i wrote a small script to start the websocket server automatically in start-ws.ts (once again, my choice of naming, so i can remember things). okay, updated the package.json file with new dependencies i need, i should go to bed, maybe?let me install the new dependencies again ```pnpm install```.



okay, i have created the constants file to include serum dex program ID and also the react hook to consume the websocket data in our frontend in useOrderbook.ts. and then created the component to display the orderbook in orderbook.tsx

Let me just fix the casing issue i am currently facing. i renamed the orderbook component file for that now sha. And to fix the hook casing issue, i will update the useOrderbook.ts file too for that.

okay, updated that. now let me update the trade page to use the correctly cased components i did now sha. so page.tsx updated now!

since i have setup the realtime orderbook functionality, let me just start the websocket server and test it.

oh, let me reinstall all the required dependencies for this to work:
```bash
pnpm add @solana/web3.js @project-serum/serum decimal.js
```