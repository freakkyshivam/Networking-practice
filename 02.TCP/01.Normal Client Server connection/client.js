import net from 'node:net';

const PORT = 4252;
const HOST = '192.0.0.2'

const client = net.createConnection({port : PORT, host : HOST}, ()=>{
    console.log("Client connected to the server");

    setInterval(() => {
        client.write(JSON.stringify({
            type : "laptop_2",
            name : "Shiavm"
        }))
    }, 2000);
    
})


client.on("data", (data)=>{
    console.log(`Get msg from server ${data.toString()}`);
    // client.end();
})

client.on("end", ()=>{
    console.log("Disconnected from server");
})

client.on("error", (err)=>{
    console.log("Client connection error : ", err);
    
})