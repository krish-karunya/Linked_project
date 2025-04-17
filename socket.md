# Socket :

Socket.IO is a library that enables `low-latency, bidirectional and event-based` communication between a client and a server.

server side config steps :

step -1 : npm i socket.io
step-2 : whenever we using the socket we need to create a manually server using "http" traditional method , why because we need to pass the express server in to socket server , using express we can't achieve those feature, when we create a server using http we have a more control over our server

step -3 : Instead of app.listening we need to write server.list => this server is a httpServer which we create using http , Socket server is the wrapper of out http server
step -4 : To listening the socket we need to write

                    Eg: const server = http.createServer(app)
                        const io = new Server(server)

                        io.on("connection",(socket)=>{

                        socket.on("disconnect",()=>{
                            console.log("disconnected)
                        })

                        })
