import net from "node:net";

export const connectToDevice = (device) => {
  console.log(`Connecting to ${device.udpAddress}:${device.tcpPort}`);

  const client = net.createConnection({
    host: device.udpAddress,
    port: device.tcpPort,
  });

  socket.on("connect", () => {
    console.log(`TCP connected to ${device.sessionId}`);
  });

  socket.on("data", (data) => {
    console.log(`Msg Received: ${data.toString()}`);
  });

  socket.on("close", () => {
    console.log(`TCP connection closed: ${device.sessionId}`);
  });

  socket.on("error", (err) => {
    console.log(`TCP connection error: ${err.message}`);
  });

  return socket;
};
