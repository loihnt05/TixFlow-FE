FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_OIDC_AUTHORITY=http://localhost:8180/realms/tixflow
ARG NEXT_PUBLIC_OIDC_CLIENT_ID=tixflow-web
ARG NEXT_PUBLIC_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback
ARG NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
ENV NEXT_PUBLIC_OIDC_AUTHORITY=$NEXT_PUBLIC_OIDC_AUTHORITY
ENV NEXT_PUBLIC_OIDC_CLIENT_ID=$NEXT_PUBLIC_OIDC_CLIENT_ID
ENV NEXT_PUBLIC_OIDC_REDIRECT_URI=$NEXT_PUBLIC_OIDC_REDIRECT_URI
ENV NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI=$NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI
RUN npm run build

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

