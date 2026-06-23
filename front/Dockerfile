FROM ghcr.io/pnpm/pnpm:11
RUN pnpm runtime set node 22 -g

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --config.dangerouslyAllowAllBuilds=true

COPY ./src ./src
COPY ./public ./public
COPY index.html vite.config.js ./

RUN pnpm run build

EXPOSE 5173

CMD [ "pnpm", "run", "preview" ]