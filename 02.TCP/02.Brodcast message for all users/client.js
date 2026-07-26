import net from 'node:net';

const PORT = 8080;
const HOST = '127.0.0.1';

const client = net.createConnection({port : PORT, host : HOST}, ()=>{
    console.log("Client connected to the server");
})


 
    setInterval(() => {
        client.write(JSON.stringify({
            type :  "device_1",
            name : "Shivam"
        }))
    }, 2000);


    client.on("data", (data)=>{
        console.log(`Get msg from server ${data}`);
    })

    client.on("end", ()=>{
        console.log("Client disconnected from server");
    })

    client.on('error', (err)=>{
        console.log("Client connection error : ", err);
    })

