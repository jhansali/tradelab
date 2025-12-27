FROM node:20-alpine

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
