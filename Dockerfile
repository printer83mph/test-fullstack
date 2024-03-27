# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app


# Prune step to isolate backend
FROM base as pruner

RUN npm install -g turbo

WORKDIR /app

COPY --link . ./
RUN turbo prune backend --docker


# Throw-away build stage to reduce size of final image
FROM base as build

WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Copy application code
COPY --link --from=pruner /app/out/full .
RUN npm install

# Build application
RUN npm run build


# Final stage for app image
FROM base

WORKDIR /app

# # Copy built application
COPY --from=build /app .

# Set production environment
ENV NODE_ENV=production

# # Start the server by default, this can be overwritten at runtime
WORKDIR /app/apps/backend
CMD [ "npm", "run", "start" ]