const express =  require ('express');
const app = express();
const http = require ('http');
const {Server} =require('socket.io');
const ACTIONS = require('./src/Action');
const server = http.createServer(app);

const io = new Server(server);

const usersocketmap={};
function getallconnectedclients(roomid){
    return Array.from(io.sockets.adapter.rooms.get(roomid)||[]).map((socketid)=>{
        return {
            socketid,
            username:usersocketmap[socketid]
        }
    });
}

io.on('connection' , (socket)=>{
    console.log('socket connected' ,socket.id);
    socket.on(ACTIONS.JOIN,({roomid,username})=>{
        usersocketmap[socket.id] = username;
        socket.join (roomid);
        const clients = getallconnectedclients(roomid);
        clients.forEach(({socketid})=>{
            io.to(socketid).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketid:socketid,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE , ({roomid,code})=>{
        socket.in(roomid).emit(ACTIONS.CODE_CHANGE ,{code});
    })

    socket.on(ACTIONS.SYNC_CODE , ({socketid,code})=>{
        io.to(socketid).emit(ACTIONS.CODE_CHANGE ,{code});
    })

    socket.on("disconnecting",()=>{
  
        const rooms = [...socket.rooms];
       
        rooms.forEach((roomid)=>{
            socket.in(roomid).emit(ACTIONS.DISCONNECTED , {
                socketid:socket.id,
                username:usersocketmap[socket.id],
            })
        })
        delete usersocketmap[socket.id]
        socket.leave();
    })
})


const port = process.env.PORT || 5000 ;
server.listen(port ,()=>console.log(`listening on ${port}`)) 