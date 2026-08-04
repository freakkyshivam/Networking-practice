import dgram from "node:dgram";
import { Buffer } from "node:buffer";

// send string data
const msg1 = Buffer.from("Hello , How are you");

// end json data
const msg2 = Buffer.from(JSON.stringify({
    type: "presence",
    name : "Desktop"
}))

const client = dgram.createSocket("udp4");

client.on("listening", () => {
  client.setBroadcast(true);

  setInterval(() => {
    client.send(msg1, 12345, "255.255.255.255", (err) => {
      if (err) {
        console.log("Error ", err);
      client.close();
      }
    });
  }, 2000);
});

client.bind(12344);
