import net from 'node:net'

const server = net.createServer((socket)=>{

    console.log(`Client connected , address : ${socket.remoteAddress}, PORT : ${socket.remotePort}`);
    

    socket.on('data', (data)=>{
        console.log(`New message from client ${data.toString()}`);
        
        socket.write(`Get msg from serevr : Hello from server`);
    })
    
    socket.on('end', ()=>{
        console.log("CLlent disconnected");
    })

    socket.on('error', (err)=>{
        console.log("TCP connection server error : ", err.message);
    })
});


const PORT = 4252;
const HOST = "0.0.0.0"

server.listen(PORT, HOST, () => {
    console.log(`TCP Server is listening on ${HOST}:${PORT}`);
});