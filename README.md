# signaling-channel-server 信令服务器
A signaling-channel-server for webRTC applications 

## 使用方法
npm run dev

## client
```
import io from "socket.io-client";

socket = io("ws://localhost:1234");

socket.on("connect", (msg: string) => {
  console.log("connect   websocket 连接完成");
});

socket.on("disConnect", (msg: string) => {
  console.log("disConnect websocket 断开");
});
```
