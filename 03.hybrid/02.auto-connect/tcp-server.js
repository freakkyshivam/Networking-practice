import net from 'node:net';

const TCP_PORT = 8080;

export const strartTcpServer = ()=>{

    const server = net.createServer(socket=>{
        const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

        console.log("TCP client connected : ", clientId);

        socket.on('data', (data)=>{
            console.log(`Msg from ${clientId}: ${data.toString()}`);
        })

         socket.on("close", () => {
      console.log(`TCP client disconnected: ${clientId}`);
    });

    socket.on("error", (err) => {
      console.log(
        `TCP client error: ${err.message}`
      );
    });
        
    });

    server.on("error", (err) => {
    console.log("TCP server error:", err);
  });


  server.listen(TCP_PORT, "0.0.0.0", () => {
    console.log(`TCP server listening on ${TCP_PORT}`);
  });

}