# using pnpm image to avoid installing pnpm manually
FROM ghcr.io/pnpm/pnpm:11

RUN pnpm runtime set node 22 -g

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --config.dangerouslyAllowAllBuilds=true

COPY tsconfig.json tsconfig.build.json ./
COPY ./src ./src

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main"]