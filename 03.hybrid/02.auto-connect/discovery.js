import dgram from "node:dgram";
import crypto from "node:crypto";

import {
  addDevice,
  removeDevice,
  getDevices
} from './discovery-registery.js'

const TCP_PORT = 8080;

export const startDeviceDiscovery= ()=>{

const socket = dgram.createSocket("udp4");

const sessionId = crypto.randomUUID();

socket.on("listening", () => {
  socket.setBroadcast(true);

  const msg = JSON.stringify({
  type: "ANNOUNCE",
  sessionId,
  tcpPort : TCP_PORT
});

  setInterval(() => {
  socket.send(msg, 4242, "255.255.255.255", (err) => {
    if (err) {
      console.error(" UDP Socket Error: ", err);
      socket.close();
    }
  });

  },3000);

  const address = socket.address();
  console.log(`UDP device dicovery server running ${address.address}:${address.port}`);
});

socket.on("message", (msg, rinfo) => {
  try {
    const data = JSON.parse(msg);

    if (data.sessionId == sessionId) {
      return;
    }

    addDevice({
      sessionId: data.sessionId,
      tcpPort : data.tcpPort,
      udpPort: rinfo.port,
      udpAddress: rinfo.address,
      udpFamily: rinfo.family,
      lastSeen: Date.now(),
    });


  } catch (err) {
    console.log("Invalid data : ", err.message);
  }
});

setInterval(() => {
  const now = Date.now();

  const devices = getDevices()
  for (const [id, device] of devices) {
    if (now - device.lastSeen > 6000) {
      console.log(`${device.sessionId} offline`);
      removeDevice(id);
    }
  }
}, 3000);

socket.on("error", (err) => {
  console.log("UDP device discovery socket error : ", err);
  socket.close();
});

socket.bind(4242);

}
