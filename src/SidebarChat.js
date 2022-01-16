import { Avatar } from '@material-ui/core';
import React,{useState,useEffect, useRef} from 'react';
import "./SidebarChat.css";
import {collection,addDoc,doc,query,orderBy,onSnapshot} from "firebase/firestore";
import db from "./firebase";
import {Link} from "react-router-dom";

function SidebarChat({id,name,addNewChat}) {
    const[seed,setSeed]=useState("");
    const[messages,setMessages]=useState([]);
    const count=useRef(0);
    const [avatar,setAvatar]=useState("");

    useEffect(()=>{
        if(id){
            const a1=collection(db,"rooms");
            const b1=doc(a1,id);
            const c1=collection(b1,"messages");
            const d1=query(c1,orderBy("timestamp","desc"));
            onSnapshot(d1,snapshot=>(
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));
        }
    },[id]);

    useEffect(() => {
        if(id){
            const a1=collection(db,"rooms");
            const b1=doc(a1,id);
            onSnapshot(b1,snapshot=>(
                setSeed(snapshot.data().avatar)
            ));
        }
    },[id]);

    const createChat=() =>{
        const roomName=prompt("Please enter name for chat");

        if(roomName){
            //do some clever database stuff...
            addDoc(collection(db,"rooms"), {
                name: roomName,
                avatar: count.current++,
            });
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ):(
        <div onClick={createChat} className="sidebarChat">
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChat;
