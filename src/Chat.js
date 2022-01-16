import { Avatar,IconButton } from '@material-ui/core';
import React, { useEffect,useRef,useState } from 'react';
import "./Chat.css";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AttachFile, InsertEmoticon, Mic, SearchOutlined } from '@material-ui/icons';
import {useParams,Link} from "react-router-dom";
import db from "./firebase";
import { collection,doc,onSnapshot,orderBy,query,serverTimestamp } from 'firebase/firestore';
import { addDoc } from "firebase/firestore";
// import * as admin from 'firebase-admin';
import firebase from 'firebase/compat/app';
import { useStateValue } from './StateProvider';
import { firestoreConnect, getFirebase } from 'react-redux-firebase';

function Chat() {
    const [seed,setSeed]=useState("");
    const [input,setInput]=useState("");
    const {roomId}=useParams();
    const [roomName, setRoomName]=useState("");
    const [messages,setMessages]=useState([]);
    const [{user},dispatch]=useStateValue();

    function dropDown(){
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // window.onclick = function(event) {
    //     if (!event.target.matches('.dropbtn')) {
    //       var dropdowns = document.getElementsByClassName("dropdown-content");
    //       var i;
    //       for (i = 0; i < dropdowns.length; i++) {
    //         var openDropdown = dropdowns[i];
    //         if (openDropdown.classList.contains('show')) {
    //           openDropdown.classList.remove('show');
    //         }
    //       }
    //     }
    // }

    useEffect(()=>{
        if(roomId){
            const a=collection(db,"rooms");
            const b=doc(a,roomId);
            onSnapshot(b,snapshot=>(
                setRoomName(snapshot.data().name)
            ));


            const a1=collection(db,"rooms");
            const b1=doc(a1,roomId);
            const c1=collection(b1,"messages");
            const d1=query(c1,orderBy("timestamp","asc"));
            onSnapshot(d1,snapshot=>(
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));

        }
    },[roomId])

    useEffect(() =>{
        if(roomId){
            const a1=collection(db,"rooms");
            const b1=doc(a1,roomId);
            onSnapshot(b1,snapshot=>(
                setSeed(snapshot.data().avatar)
            ));
        }
    },[roomId]);

    const sendMessage=(e) =>{
        e.preventDefault();
        console.log("You typed >>>",input);
        
        const a2=collection(db,"rooms");
        const b2=doc(a2,roomId);
        
        addDoc(collection(b2,"messages"),{
            message: input,
            name: user.displayName,
            timestamp: serverTimestamp(),
        });

        // const fieldValue = useFirestore.FieldValue;
        // time: fieldValue.serverTimestamp()
        setInput("");
    };

    return (
        <div className="chat">
            <div className="chat__header">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

            <div className="chat__headerInfo">
                <h3>{roomName}</h3>
                <p>Last seen at {" "}
                {new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()}</p>
            </div>

            <div className="chat__headerRight">
                    <IconButton> 
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <div className="dropdown">
                        <IconButton>
                            <MoreVertIcon onClick={dropDown} className="dropbtn" />
                                <div id="myDropdown" className="dropdown-content">
                                    <Link id="myDropdownContent" to={`/rooms/${roomId}/groupInfo`}>Group Info</Link>
                                    <Link id="myDropdownContent" to={`/rooms/${roomId}/clearMsg`}>Clear Messages</Link></div>
                        </IconButton>
                    </div>
            </div>
            </div>

            <div className="chat__body">
                {messages.map((message)=>(
                    <p className={`chat__message ${message.name===user.displayName && "chat__receiver"}`}>
                    <span className="chat__name">{message.name}</span>{message.message}
                    <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span></p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <form >
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat
