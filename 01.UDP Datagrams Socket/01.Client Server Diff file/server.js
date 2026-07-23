import dgram from 'node:dgram';

 const server = dgram.createSocket("udp4");

 server.on('error', (err)=>{
    console.log(`Server error ${err.stack}`);
    server.close();
 })

 server.on('message', (msg, rinfo)=>{
 
   try {
      const data = JSON.parse(msg);
       console.log(`Server got msg  from ${rinfo.address} : ${rinfo.port}`);
       console.log(`Type : ${data.type}`);
       console.log(`Name : ${data.name}`);
       
   } catch  {
      console.log(`Server got msg ${msg} from ${rinfo.address} : ${rinfo.port}`);
   }
   
 })

 server.on('listening', ()=>{
    const address = server.address();
    console.log(`Server listening ${address.address} : ${address.port}`)
    
 })

 server.bind(12345,)