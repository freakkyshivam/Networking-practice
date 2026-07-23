
 import net from 'node:net'

const clients = [];

const server = net.createServer((socket)=>{

    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected : ${clientId}`);


    socket.setEncoding('utf-8');

    clients.push(socket);

      socket.write(`Welcome to the chat server! There are ${clients.length} users online.\r\n`);

    function brodcast(msg, sender){

        clients?.forEach(client=>{
            if(client !== sender){
                socket.write(msg)
            }
        })
    }

    brodcast(`User ${clientId}, joined to the chat`, socket);

    socket.on('data', (data)=>{
        brodcast(`${clientId} : ${data}`)
    })

    socket.on('end', ()=>{
        console.log(`Client ${clientId} are disconnected`);
    })

     socket.on('error', (err) => {
    console.error(`Socket error from ${clientId}:`, err);
  });
    
})

server.listen(8080, "127.0.0.1", ()=>{
    console.log('Server listen at : 8080');
})

server.on('error', (err)=>{
    console.log('Server error : ', err);
    
})