FROM node:current as build

ARG REACT_APP_API_URL
ARG REACT_APP_HOST
ARG REACT_APP_PROTOCOL
ARG REACT_APP_OAUTH_CLIENT_ID

COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /build /usr/share/nginx/html
COPY --from=build /docker/production/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx"]


