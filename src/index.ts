import koa from "koa";
import http from "http";

import middleware from "@/middleware";
import { initSocket } from "@/util/socket";

const app = new koa();
const server = http.createServer(app.callback());

initSocket(server);

middleware.map((item) => {
  app.use(item);
});

server.listen(1234, () => {
  console.log("listening on *:1234");
});
