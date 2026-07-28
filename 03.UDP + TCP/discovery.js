import dgram from 'node:dgram';
import crypto from "node:crypto";

const socket = dgram.createSocket('udp4');

const sessionId = crypto.randomUUID();

socket.on('listening', ()=>{

    socket.setBroadcast(true)

    const msg = JSON.stringify({
        msg : "Device connected",
        sessionId
    })

    socket.send(msg,4242, "255.255.255.255", (err)=>{
         if(err){
            console.error(" Socket Error: ", err);
            socket.close();
        }
    })

    const address = socket.address();
    console.log(`UDP server running ${address.address}:${address.port}`);
})

const discoveredDevices = new Map();

socket.on('message', (msg, rinfo)=>{

    try {
        const data = JSON.parse(msg);

        if(data.sessionId == sessionId){
            return;
        }

        discoveredDevices.set(sessionId, {
            sessionId : sessionId,
            udpPort : rinfo.port,
            udpAddress : rinfo.address,
            udpFamily : rinfo.family,
            lastSeen : new Date()
        })

    } catch (err) {
        console.log("Invalid data : ", err.message);
    }
})

setInterval(()=>{
    const now = new Date();

    for(const [id, device] of discoveredDevices){
        if(now - device.lastSeen > 6000){
            console.log(`${device.sessionId} offline`);
            discoveredDevices.delete(id);
        }
    }
}, 3000);

socket.on('error', (err)=>{
    console.log("UDP socket error : ", err);
    socket.close();
})

socket.bind(4242);