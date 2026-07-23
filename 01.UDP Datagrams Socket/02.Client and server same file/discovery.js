import dgram from 'node:dgram';
import { randomUUID } from 'node:crypto';


const socket = dgram.createSocket('udp4');

const sessionId = randomUUID();

socket.on('error', (err)=>{
   console.log("Error : ", err);
   socket.close();
})

// send string data
const msg1 = Buffer.from("Hello , How are you");

// end json data
const msg2 = Buffer.from(JSON.stringify({
    type: "presence",
    name : "Desktop",
    sessionId
}))

socket.on('listening', ()=>{
    socket.setBroadcast(true);

    setInterval(() => {
          socket.send(msg2, 41253, "255.255.255.255", (err)=>{
        if(err){
            console.error("Error: ", err);
            socket.close();
        }
    })
    }, 2000);

  

    const address = socket.address();
    console.log(`Server listening ${address.address} : ${address.port}`)
})


socket.on('message', (msg, rinfo)=>{
    
   try {
      const data = JSON.parse(msg);
      if(data.sessionId === sessionId) return;
       console.log(`Server got msg from ${rinfo.address} : ${rinfo.port}`);
       console.log(`Type : ${data.type}`);
       console.log(`Name : ${data.name}`);
       console.log("\n");
       
   } catch  {
      console.log(`Server got msg ${msg} from ${rinfo.address} : ${rinfo.port}`);
   }
   
 })

socket.bind(41253);