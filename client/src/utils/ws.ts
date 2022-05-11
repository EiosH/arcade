import EventEmitter from "events";

type ConstructorParameters<T> = T extends new (...args: infer P) => any
  ? P
  : never;

type WSParams = ConstructorParameters<typeof WebSocket>;

type TaskQueue = {
  data: any;
  createTime: number;
  retry: number;
};

enum ReadyState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

const expireTime = 10000;
const maxRetryTime = 3;

class WS extends WebSocket {
  taskQueue: TaskQueue[] = [];
  callbackList: Function[] = [];
  messageEvent = new EventEmitter();

  constructor(...arg: WSParams) {
    super(...arg);

    this.onopen = () => {
      const taskQueue = this.taskQueue;

      while (taskQueue.length) {
        const task = taskQueue.shift();
        const { createTime, data, retry } = task;

        const isExpire = createTime && Date.now() - createTime > expireTime;
        if (!isExpire) {
          this.sendData(data, retry + 1);
        }
      }
    };

    this.onmessage = (message) => {
      const { data } = message;
      this.messageEvent.emit("message", JSON.parse(data));
    };

    // return new WS(...arg);
  }

  addOnMessage(callback: (arg: any) => void) {
    if (!callback) return;
    this.messageEvent.on("message", callback);
  }

  isOpen = () => this.readyState === ReadyState.OPEN;
  isConnecting = () => this.readyState === ReadyState.CONNECTING;

  sendData = (data: any, retry = 0) => {
    if (this.isOpen()) {
      this.send(JSON.stringify(data));
    } else if (this.isConnecting()) {
      if (retry > maxRetryTime) return;
      this.taskQueue.push({
        data,
        createTime: Date.now(),
        retry,
      });
    }
  };
}

export default WS;
