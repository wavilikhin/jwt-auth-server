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