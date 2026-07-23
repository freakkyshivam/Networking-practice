import net from 'node:net'

const server = net.createServer((socket)=>{

    console.log(`Client connected , address : ${socket.remoteAddress}, PORT : ${socket.remotePort}`);
    

    socket.on('data', (data)=>{
        console.log(`New message from client ${data.toString()}`);
        
        socket.write(`Server Echo: ${data}`);
    })
    
    socket.on('end', ()=>{
        console.log("CLient disconnected");
    })

    socket.on('error', (err)=>{
        console.log("TCP connect server error : ", err);
    })
});


const PORT = 4252;
const HOST = "0.0.0.0"

server.listen(PORT, HOST, () => {
    console.log(`TCP Server is listening on ${HOST}:${PORT}`);
});