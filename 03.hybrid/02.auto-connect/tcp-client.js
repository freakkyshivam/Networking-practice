import net from "node:net";
import {connections} from './index.js'

export const connectToDevice = (device) => {
  console.log(`Connecting to ${device.udpAddress}:${device.tcpPort}`);

  const client = net.createConnection({
    host: device.udpAddress,
    port: device.tcpPort,
  });

  client.on("connect", () => {
    console.log(`TCP connected to ${device.sessionId}`);
  });

  client.on("data", (data) => {
    console.log(`Msg Received: ${data.toString()}`);
  });

  client.on("close", () => {
    console.log(`TCP connection closed: ${device.sessionId}`);
    connections.delete(device.sessionId);
  });

  client.on("error", (err) => {
    console.log(`TCP connection error: ${err.message}`);
  });

  return client;
};
