FROM node:16 AS build

USER root
WORKDIR /root
COPY ./ ./api

RUN cd ./api \
  && yarn \
  && yarn build \
  && rm -rf ./node_modules \
  && yarn --production \
  && mv ./docker/docker_entry.sh /root/docker_entry.sh \
  && chmod +x /root/docker_entry.sh \
  && mv ./dist /root/ \
  && mv ./node_modules /root/ \
  && rm -rf /root/api

FROM node:16-alpine

USER root
WORKDIR /root

COPY --from=build /root ./

RUN chmod +x /root/docker_entry.sh \
  && apk add tzdata

ENTRYPOINT ["/root/docker_entry.sh"]

CMD ["primary"]
