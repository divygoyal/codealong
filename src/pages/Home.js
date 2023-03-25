import {React, useState } from 'react'
import {v4 as uid} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomid ,setid] = useState();
    const [username ,setusername] = useState();
    const createnewid = (e)=>{
        e.preventDefault();
        const id = uid();
        setid(id);
        toast.success('New room created');
        // console.log(id);
    }
    const newroom =()=>{
        if(!roomid || !username){
            toast.error("ROOMID & Username required");
            return ;
        }

        navigate(`/editor/${roomid}` , {
            state:{
                username,roomid,
            },
        })
    }
    const helper=(e)=>{
        if(e.code=== 'Enter'){
            newroom();
        }
    }
  return (
    
    <div className='homepagewrapper'>
        <div className="formwrapper">
            <img className='imglogo' src="/logo192.png" alt="logo" /> 
            <h4 className='mainlabel'>Paste invitation ROOM ID  </h4>
        
        <div className="inputgroup">
            <input type="text" className="inputbox" placeholder='Room Id ' value={roomid} onChange={(e)=>{setid(e.target.value)}} onKeyUp={helper}/>
            <input type="text" className="inputbox" placeholder='Username' value={username} onChange={(e)=>{setusername(e.target.value)}} onKeyUp={helper}/>
            <button className='btn joinbtn' onClick={newroom}>JOIN</button> 
            <span className="createinfo">
                If you don't have any RoomId create here &nbsp;

                <a href="" className='createnewbtn' onClick={createnewid}>new room</a>
            </span>
        </div>
        </div>

        <footer>
        <h4>
        Buit with ❤️ by <a href="https://www.linkedin.com/in/divy-goyal/" target="New Page">Divy Goyal</a>
        </h4></footer>
    </div>
    
    
  )
}

export default Home
