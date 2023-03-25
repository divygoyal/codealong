import React, { useEffect, useRef } from 'react'
import codemirror from 'codemirror';
import './../App.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Action';
const Editor = ({roomid , socketref,oncodechange}) => {
  const editorref = useRef(null);
  useEffect(()=>{
    async function init(){
      editorref.current = codemirror.fromTextArea(document.getElementById('realtimeeditor'),{
        mode:{name:'javascript',json:true},
        theme:'dracula',
        autoCloseTags:true,
        autoCloseBrackets :true,
        lineNumbers:true,
      });

      editorref.current.on('change' , (instances,changes)=>{
        const {origin} = changes;
        const code = instances.getValue();
    
        oncodechange(code);
        
        if(origin!== 'setValue'){
          socketref.current.emit(ACTIONS.CODE_CHANGE , {
            roomid,
            code,
          })
        }

      })

     

    }
    init();
  },[]);

  useEffect(()=>{

    if(socketref.current){
      console.log("changeee")
      socketref.current.on(ACTIONS.CODE_CHANGE , ({code})=>{
        if(code!==null){
          
          editorref.current.setValue(code);
        }
      })
    }
    return ()=>{
      socketref.current.off(ACTIONS.CODE_CHANGE)
    }
    
  },[socketref.current])
  return <textarea id="realtimeeditor" ></textarea>;
//  <textarea name="" id="" cols="30" rows="10"></textarea>
  
};

export default Editor;
