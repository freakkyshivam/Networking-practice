// Node.js ka built-in UDP networking module.
// dgram used for create UDP socket
import dgram from "node:dgram";


import crypto from "node:crypto";

// UDP scoket create
//  "udp4"  ka mtlb IPv4 based UDP socket
const socket = dgram.createSocket("udp4");

// Har baar application start hone per ek unique session id generate hogi
//  ye current running device session ko indetify karega
const sessionId = crypto.randomUUID();

// listening event tab execute hota hai jab socket successfully bind hokar
// incoming UDP msg receive karne ke liye ready ho jata hai
socket.on("listening", () => {

  // socket ko brodcast msg bhejne ki permission de rahe hain
  // iske bina 255.255.255.255 par broadcast send nhi kar payenge
  socket.setBroadcast(true);

  // apna discivery/announcement msg create kar rahe hain
  //
  // type batata hai ki packet kis purpose ke liye hai
  // sessionId batata hai ki announcement kis device/session se aaya hai
  const msg = JSON.stringify({
    type:"ANNOUNCE",
    sessionId,
});

// har 3 sec me apni presence network par announce karenege
//
// iska purpose doosere device ko batna hai : "main netwok par availble hoon"
  setInterval(() => {

    // UDP brodcast send kar rahe hain
    //
    // msg --> jo data bhejna hai
    // 4242 --> destination UDP port
    //brodcast --> network ke availble devices tak packet pahucnchane ki kosish 
  socket.send(msg, 4242, "255.255.255.255", (err) => {

    // agar UDP packet send karte waqt error aaye to error print karke socket close
    if (err) {
      console.error(" Socket Error: ", err);
      socket.close();
    }
  });

  },3000);

  // socket.address() se current socket ki info milta hai
  // jaise ip address aur port
  const address = socket.address();

  console.log(`UDP server running ${address.address}:${address.port}`);
});


// discovered devices ko memeory me store karne ke liye map ka use

// Key --> sessionId, Value ---> device ki info

/**
 eg : sessionId ->{
      sessionId,
      udpPort, 
      udpAddress,
      lastSeen
 }
 */
const discoveredDevices = new Map();

// jab bhi UDP socket ko msg receive hota hai, ye callback execute hota hai

// msg  --> receive UDP data
// rinfo --> sender ki info like IP address, port , family
socket.on("message", (msg, rinfo) => {

  try {
    // UDP msg Buffer ke form me aata hai
    //JSON.parse() ko string chaiye, isiliye  Buffer ko automatically string representation me parse kar rahe hain
    const data = JSON.parse(msg);

    // agar received packet hamare hi session/device ka hota hai to packet ko ignore kar dete hain
    // q ki hum khud bhi brodcast bhej rahe hain aur brodcast hume khud bhi receive ho sakta hai
    if (data.sessionId == sessionId) {
      return;
    }

      // Device ko registry me store/update kar rahe hain.
    
    // data.sessionId ko key banaya hai.
    // Iska benefit:
    // same device dobara announce karega to existing entry update ho jayegi
    discoveredDevices.set(data.sessionId, {

      // remote device ka session id
      sessionId: data.sessionId,

      // remote device jis UDP port se packet bhej rha hai
      udpPort: rinfo.port,

      // remote device ka ip address
      udpAddress: rinfo.address,

      // address family, normally 'IPv4
      udpFamily: rinfo.family,

      // Last time jab is device ka announcement receive hua
      lastSeen: new Date(),
    });


  } catch (err) {
     // Agar received message valid JSON nahi hai to application crash nahi karegi.
    console.log("Invalid data : ", err.message);
  }
});


// Har 3 seconds me check karenge ki discovered devices abhi bhi network par active hain ya nahi.
setInterval(() => {
  // current time in mili sec
  const now = new Date();

   // Map ke andar stored har device par iterate kar rahe hain.
  //
  // id     -> Map ki key, yani sessionId
  // device -> us device ki stored information
  for (const [id, device] of discoveredDevices) {
     // Current time aur device ke lastSeen ke beech ka difference.

       // Agar difference 6000 milliseconds se zyada hai,
    // matlab 6 seconds se us device ka koi announcement nahi aaya.
    if (now - device.lastSeen > 6000) {

      // Device ko offline mark kar rahe hain.
      console.log(`${device.sessionId} offline`);

      // Device ko registry se remove kar rahe hain.
      discoveredDevices.delete(id);
    }
  }
}, 3000);

// Agar socket ke saath koi error occur hota hai ye event execute hoga
socket.on("error", (err) => {
  console.log("UDP socket error : ", err);
  socket.close();
});

// UDP socket ko port 4242 par bind kar rahe hain.
//
// Iske baad socket:
// 1. UDP messages receive kar sakta hai
// 2. Port 4242 se associated ho jayega
// 3. "listening" event trigger hoga
socket.bind(4242);
