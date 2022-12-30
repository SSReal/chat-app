import {db} from "../firebase";
import _ from "lodash";

import {addDoc, collection, doc, getDoc, getDocs, orderBy, query, where} from "firebase/firestore";
import { useEffect, useState } from "react";

function ChatUI(props) {

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

    const chatRef = collection(db, 'chats');
    const userRef = collection(db, 'users');

    useEffect(() =>{
        async function getChats() {
            const chatDocs = (await getDocs(query(chatRef, orderBy('timestamp', 'asc')))).docs;
            const allChats = chatDocs.map((docSnapshot) => docSnapshot.data());
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
        };
        getChats();
    }, [props.user.uid])

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
            </div>
            <input placeholder = "Type a message" text = {chatText} onChange = {changeText}/>
            <button onClick = {sendMessage}>Send</button>
        </div>
    )
}

export default ChatUI;