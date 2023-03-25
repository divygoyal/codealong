import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor';
import { initsocket } from '../Socket';
import ACTIONS, { SYNC_CODE } from '../Action';
import { useLocation, useNavigate,Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Editorpage = () => {
    const reactnavigator = useNavigate();
    const socketref = useRef(null);
    const location = useLocation();
    const coderef = useRef(null);
    const params = useParams();
    const [clients,setclients] = useState([]);
    useEffect(()=>{
        console.log(coderef.current);
        const init = async ()=>{
            socketref.current = await initsocket();
            socketref.current.on('connect_error',(err)=>handleErrors(err));
            socketref.current.on('connect_failed',(err)=>handleErrors(err));

            function handleErrors(e){
                console.log('error' , e);
                toast.error('try again later');
                reactnavigator('/');
            }
            
            socketref.current.emit(ACTIONS.JOIN,{
                
                roomid:params.RoomId,
                username : location.state?.username,
            })

            socketref.current.on(ACTIONS.JOINED,({clients,username,socketid})=>{
                if(username!== location.state?.username){
                    toast.success(`${username} joined the rooom`);
                    console.log(`${username}`);
                }

                setclients(clients);
                
                socketref.current.emit(ACTIONS.SYNC_CODE , {
                    
                    code : coderef.current,
                    socketid
                })
            })

            socketref.current.on(ACTIONS.DISCONNECTED,({socketid,username})=>{
                
                toast.success(`${username} left the room `);
                setclients((prev)=>{
                    return prev.filter((client)=>client.socketid !== socketid)
                })
            })
        }
        init();

        return ()=>{
            socketref.current.disconnect();
            socketref.current.off(ACTIONS.JOINED);
            socketref.current.off(ACTIONS.DISCONNECTED);
        }
        
    },[])

   async function copyroomid() {
    try {
        await navigator.clipboard.writeText(params.RoomId);
        toast.success('copied successfully');
    } catch (error) {
        console.log(error);
        toast.error(error);
    }
   }

    async function leavebtn(){
        try {
            console.log(coderef.current);
            await reactnavigator('/');
            toast.success(`${location.state?.username} leaved the room `)
        } catch (error) {
            console.log(error);
            toast.error('error');
        }
    }

    if(!location.state){
        return <Navigate to = "/" />
    }
  return (

    
    <div className="mainwrap">
        <div className="aside">
            <div className="asideinner">
                <div className="logo">
                    <img className='logoimg' src="/logo192.png" alt="logo" />
                </div>
                <h3>connected</h3>
                <div className="clientlist">
                    {
                        clients.map((clients)=>(
                            <Client key={clients.socket} username={clients.username}/>
                        ))
                    }
                </div>
            </div>
            <button className='btn copybtn' onClick={copyroomid} >Copy ROOM ID</button>
            <button className='btn leavebtn' onClick={leavebtn}>Leave</button>
        </div>
        <div className="editorwrap">
            <Editor socketref = {socketref} roomid = {params.RoomId} oncodechange ={(code)=>{
                coderef.current = code; 
            }}/>
        </div>
    </div>
  )
}

export default Editorpage
