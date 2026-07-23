import net from 'node:net';

const PORT = 4252;
const HOST = '127.0.0.1';

const client = net.createConnection({port : PORT, host : HOST}, ()=>{
    console.log("Client connected to the server");
    client.write("Hello, from client")
})


client.on("data", (data)=>{
    console.log(`Get msg from server ${data.toString()}`);
    client.end();
})

client.on("end", ()=>{
    console.log("Disconnected from server");
})

client.on("error", (err)=>{
    console.log("Client connection error : ", err);
    
})