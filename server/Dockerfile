FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a
# uncomment for production:
ENV NODE_ENV production
RUN apk add dumb-init
WORKDIR /usr/src/server
COPY --chown=node:node package*.json /usr/src/server/
RUN npm ci --only=production
# uncomment for dev:
# RUN npm install nodemon
COPY --chown=node:node . .
USER node
# uncomment for production:
CMD ["dumb-init", "node", "app.js"]


# --------------> The build image version
# FROM node:latest AS build
# ARG NPM_TOKEN
# WORKDIR /usr/src/app
# COPY package-*.json /usr/src/app/
# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
#    npm ci --only=production && \
#    rm -f .npmrc
 
# # --------------> The production image
# FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a
# RUN apk add dumb-init
# ENV NODE_ENV production
# USER node
# WORKDIR /usr/src/app
# COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
# COPY --chown=node:node . /usr/src/app
# CMD ["dumb-init", "node", "server.js"]