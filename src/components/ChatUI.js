import {db} from "../firebase";
import _ from "lodash";

import {addDoc, collection, doc, getDoc, onSnapshot, orderBy, query} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

function ChatUI(props) {

    const chatBottomRef = useRef(null);

    const [chats, setChats] = useState([]);
    const [userDict, setUserDict] = useState({[props.user.uid]: props.user});
    // console.log(userDict);

    function renderChat(chat) {
        if(chat.type === "text") {

            if(chat.sender === props.user.uid) {
                return <div className = "message sent-message"><b>Me: </b>{chat.content}</div>
            }
            else {
                return <div className = "message received-message"><b>{userDict[chat.sender].displayName + ": "}</b>{chat.content}</div>
            }
        }
    }
    
    

    useEffect(() => {
        const chatRef = collection(db, 'chats');
        const userRef = collection(db, 'users');
        const unsub = onSnapshot(query(chatRef, orderBy('timestamp', 'asc')), 
            async (querySnapshot) => {
                const chatDocs = querySnapshot.docs;
                const allChats = chatDocs.map((d)=>d.data());
                console.log(allChats);
                const users = {};
                for(const chat of allChats) {
                    if(!users[chat.sender]) {
                        console.log(chat.sender);
                        const userDoc = (await getDoc(doc(userRef, chat.sender))).data();
                        console.log(userDoc);
                        users[chat.sender] = userDoc;
                    }
                }
                console.log(users);
                setUserDict(users);
                setChats(allChats);
            }
        )
        return unsub;
    }, [])

    useEffect(() => {
        console.log("run");
        console.log(chatBottomRef.current);
        chatBottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chats]);

    const [chatText, setChatText] = useState("");
    function changeText(e) {
        setChatText(e.target.value);
    }

    async function sendMessage() {
        const newMsg = {
            content: chatText,
            type: "text", 
            sender: props.user.uid,
            receiver: "sajal", //for testing
            timestamp: new Date(),
        }
        const chatRef = collection(db, 'chats');
        const newRef = await addDoc(chatRef, newMsg);
        console.log("successfully added as: " + newRef.id)
        setChats(_.concat(chats, newMsg));
    }
    return (
        <div className = "chat-ui">
            <div className = "chats">
                {
                    chats.map((chat) => renderChat(chat))
                }
                <div ref = {chatBottomRef} />
            </div>
            <div className = "edit-message">
                <input className = "message-text" placeholder = "Type a message" text = {chatText} onChange = {changeText}/>
                <button className = "send-button" onClick = {sendMessage}><span className="material-symbols-outlined">send</span></button>
            </div>
        </div>
    )
}

export default ChatUI;