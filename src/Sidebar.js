import React, { useEffect,useState } from "react";
import { Avatar,IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import "./Sidebar.css";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import {collection,onSnapshot} from "firebase/firestore";
import { useStateValue } from './StateProvider';

function Sidebar() {
    const [{user},dispatch]=useStateValue();
    const [rooms,setRooms]=useState([]);

    useEffect(()=>{
        const a=collection(db,"rooms");
        const unsubscribe=onSnapshot(a,(snapshot)=>
            setRooms(
                snapshot.docs.map((doc)=>({
                    id:doc.id,
                    data:doc.data(),
                }))
                )
            );

            return () =>{
                unsubscribe();
            }
    },[]);

    
    // const q = query(collection(db, "rooms"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // const cities = [];
    // querySnapshot.forEach((doc) => {
    //     cities.push(doc.data().name);
    // });
    // console.log("Current cities in CA: ", cities.join(", "));
    // });


    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL}/>
                <div className="sidebar__headerRight">
                    <IconButton> 
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                {rooms.map((room)=>(
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>
        </div>
            
        
    )
}

export default Sidebar;
