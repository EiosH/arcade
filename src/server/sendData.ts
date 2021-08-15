const sendToClient = (client, data) => client.send(JSON.stringify(data));
const sendToPeer = (client, data) => client?._peer?.send(data);

export { sendToPeer, sendToClient };
