# arcade
一个 online 游戏 , 我的得意之作


## server
基于 Koa 以及 webRTC 、 webSocket 技术开发.
客户端与服务器首先进行多对一的 websocket 连接，服务器同时充当信令服务器帮助客户端与服务器进行 webRTC 连接。完成连接后，服务器充当 Router 转发不同类型、不同目标客户端消息。
客户端通过此来通信,发送游戏数据并同步.
![image](https://user-images.githubusercontent.com/48705886/167826513-c368e073-eaae-4e5b-ab37-094dd2381571.png)


## cleint
arcade 采用帧同步 + 矫正机制实现状态同步。使用 phaser.js 作为物理引擎.
demo 如下

![demo (2)](https://user-images.githubusercontent.com/48705886/167827409-40865a28-b4d0-4247-bc41-bcd33a253737.gif)
