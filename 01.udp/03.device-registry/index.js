 import dgram from 'node:dgram';
import { randomUUID } from 'node:crypto';

const socket = dgram.createSocket("udp4");

const sessionId = randomUUID();

const msg2 = Buffer.from(JSON.stringify({
    type: "presence",
    name : "Desktop",
    sessionId
}))

socket.on("error", (err)=>{
    console.log("Socket error : ",err);
    socket.close();
})


socket.on('listening', ()=>{
      socket.setBroadcast(true);

      setInterval(() => {
        socket.send(msg2, 4251,"255.255.255.255", (err)=>{
            if(err){
            console.error("Error: ", err);
            socket.close();
        }
        })
      }, 2000);

       const address = socket.address();
    console.log(`Server listening ${address.address} : ${address.port}`)
})

const discoveredDevices = new Map();

socket.on('message', (msg, rinfo)=>{

    try {

        const data = JSON.parse(msg);

        if(sessionId == data.sessionId){
            return;
        }
        discoveredDevices.set(data.sessionId, {
            type : data.type,
            name : data.name,
            lastSeen: Date.now()
        });
         console.log(`New device found ${rinfo.address} : ${rinfo.port}`);
        
    } catch (err) {
        console.log("Invalid data : ", err.message);
        
    }
})

setInterval(() => {
    const now = new Date();
    for(const [id, device] of discoveredDevices){
        if(now - device.lastSeen > 6000){
             console.log(`${device.name} offline `);
            discoveredDevices.delete(id);
        }
    }
}, 3000);

socket.bind(4251);