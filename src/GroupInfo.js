import React, {useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {Avatar, IconButton} from "@material-ui/core";
import db from "./firebase";
import { ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
import { collection,doc,onSnapshot,query,orderBy,addDoc,serverTimestamp } from 'firebase/firestore';
import "./GroupInfo.css";
import { storage } from "./firebase";
import CreateIcon from '@material-ui/icons/Create';

function GroupInfo() {
    console.log("hello");
    const[seed,setSeed]=useState("");
    const{roomId,descId}=useParams();
    const [messages,setMessages]=useState([]);
    const [descriptions,setDescriptions]=useState([]);
    const[roomName,setRoomName]=useState("");
    const[description,setDescription]=useState("");
    const[title,setTitle]=useState(false);
    const[profilePic,setProfilePic]=useState("");
    const[image,setImage]=useState(null);
    const[flag,setFlag]=useState(false);

    const editTitle=(e)=>{
        if(title===false){
            setTitle(true);
        }
        if(title===true){
            setTitle(false);
        }
    }

    const saveDescription=(e)=>{
        e.preventDefault();
        console.log(e);
        console.log(description);
        const a=collection(db,"rooms");
        const b=doc(a,roomId);
        addDoc(collection(b,"descriptions"),{
            text:description,
            timestamp:serverTimestamp(),
        });
        setTitle(false);
    }

    useEffect(()=>{
        if(roomId && descriptions){
            const a=collection(db,"rooms");
            const b=doc(a,roomId);
            const c=collection(b,"descriptions");
            const d=query(c,orderBy("timestamp","asc"));
            onSnapshot(d,snapshot=>(
                setDescriptions(snapshot.docs.map((doc) => doc.data()))
            ));
            
        }
    },[roomId,descriptions]);

    useEffect(()=>{
        if(roomId){
            const a=collection(db,"rooms");
            const b=doc(a,roomId);
            onSnapshot(b,snapshot=>(
                setSeed(snapshot.data().avatar)
            ));

            const a1=collection(db,"rooms");
            const b1=doc(a1,roomId);
            const c1=collection(b1,"messages");
            const d1=query(c1,orderBy("timestamp","asc"));
            onSnapshot(d1,snapshot=>(
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));    
        }
    },[roomId]);

    useEffect(()=>{
        if(roomId){
            const a=collection(db,"rooms");
            const b=doc(a,roomId);
            onSnapshot(b,snapshot=>(
                setRoomName(snapshot.data().name)
            ));
        }
    },[roomId]);

    const handleChange=(e)=>{
        if(e.target.files[0]){
            console.log(456);
            setImage(e.target.files[0]);
        }
        console.log(image);
        console.log("abcde");
        document.getElementsByClassName("groupInfo__uploadButton")[0].click();
    }

    const handleClick=()=>{
        setFlag(true);
        document.getElementsByClassName("grpInfo__file")[0].click();
    }

    const handleUpload=()=>{
        console.log("123");
        const a=ref(storage,`profilepics/${image.name}`);
        const uploadTask=uploadBytesResumable(a,image);

        uploadTask.on(
            "state_changed",
            ()=>{
                //complete function...
                getDownloadURL(uploadTask.snapshot.ref)
                .then(url =>{
                    //post image inside db
                    const a=collection(db,"rooms");
                    const b=doc(a,roomId);
                    const c=collection(b,"profilepics");
                    addDoc(c,({
                        timestamp: serverTimestamp(),
                        imageUrl: url

                    }));

                    setImage(null);

                    });

            })

    }

    useEffect(()=>{
        if(roomId){
            const a=collection(db,"rooms");
            const b=doc(a,roomId);
            const c=collection(b,"profilepics");
            const d=query(c,orderBy("timestamp","desc"));
            onSnapshot(d,snapshot=>(
                setProfilePic(snapshot.docs.map((doc) => doc.data()))
            ));
        }
        },[roomId]);

    return (
            <div className="groupInfo">
                <div className="groupInfo__container">
                    <div className="groupInfo__top">
                        Group Info
                    </div>
                    <div className="groupInfo__Profile">
                        {/* <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} id="avatar" /> */}
                        <img src={profilePic[0]?.imageUrl} alt="" id="avatar"/>
                        
                        <input type="file" className="grpInfo__file" onChange={handleChange}/>
                        <IconButton id="createIcon" onClick={handleClick}>
                            <CreateIcon />
                            
                        </IconButton>
                        <button className="groupInfo__uploadButton" onClick={handleUpload}>upload</button>
                        <div className="groupInfo__ProfileTitle">
                            {roomName}
                            <p className="groupInfo__createdDate">Created {" "}
                                {new Date(messages[0]?.timestamp?.toDate()).toUTCString()}</p>
                        </div>
                    </div>

                    <div className="groupInfo__description">
                        
                        <div className="groupInfo__desc">
                            <p>Description</p>
                            <IconButton id="createIcon" onClick={editTitle} type="file">
                                <CreateIcon />
                            </IconButton>
                        </div>

                        {title===true?(
                            <div className="description">
                                <form>
                                    <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Enter Description" type="text"/>
                                    <button onClick={saveDescription} type="submit">Send a message</button>
                                </form>
                            </div>):(<div className="description">{descriptions[descriptions.length-1]?.text}</div>)}
                    </div>
                </div>
                
                
            </div>
    )
}

export default GroupInfo
