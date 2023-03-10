import {db} from "../firebase";
// import _ from "lodash";

import {collection, doc, getDoc, onSnapshot, orderBy, query} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import Message from "./Message";
import MessageBox from "./MessageBox";

function ChatUI(props) {

    const chatBottomRef = useRef(null);
    // const inputRef = useRef(null);

    const [chats, setChats] = useState([]);
    const [userDict, setUserDict] = useState({[props.user.uid]: props.user});

    const [isLoading, setLoading] = useState(true);
    // // console.log(userDict);

    function renderChat(chat) {
        if(chat.type === "text") {

            if(chat.sender === props.user.uid) {
                return <Message sent content={chat.content} contentType={chat.type} />
            }
            else {
                return <Message displayName = {userDict[chat.sender].displayName} content = {chat.content} contentType={chat.type} />
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
                // console.log(allChats);
                const users = {};
                for(const chat of allChats) {
                    if(!users[chat.sender]) {
                        // console.log(chat.sender);
                        const userDoc = (await getDoc(doc(userRef, chat.sender))).data();
                        // console.log(userDoc);
                        users[chat.sender] = userDoc;
                    }
                }
                // console.log(users);
                setUserDict(users);
                setChats(allChats);
            }
        )
        setLoading(false);
        // inputRef.current?.focus();
        return unsub;
    }, [])

    // useEffect(() => {
    //     setTimeout(() => {
    //         // console.log("run");
    //         // console.log(chatBottomRef.current);
    //         chatBottomRef.current?.scrollIntoView({behavior: "smooth"});
    //     }, 1000)
    // }, [])

    useEffect(() => {
        // console.log("run");
        // console.log(chatBottomRef.current);
        chatBottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chats]);

    const [chatText, setChatText] = useState("");
    function changeText(e) {
        setChatText(e.target.value);
    }

    function handleKeyUp(e) {
        if(e.key === "Enter") {
            // console.log("enter pressed");
            sendMessage();
        }
    }

    async function sendMessage() {
        //disable sending message
        alert("Sending message is now disabled as this project is no longer actively maintained.");
        // if(chatText === "") {
        //     alert("Message can't be empty!");
        //     return;
        // }
        // const newMsg = {
        //     content: chatText,
        //     type: "text", 
        //     sender: props.user.uid,
        //     receiver: "sajal", //for testing
        //     timestamp: new Date(),
        // }
        // const chatRef = collection(db, 'chats');
        // const newRef = await addDoc(chatRef, newMsg);
        // // console.log("successfully added as: " + newRef.id)
        // // setChats(_.concat(chats, newMsg)); //TODO: fix sequence problem with some messages
        setChatText("");
    }
    return (
        <div className = "chat-ui">
            <div className = "chats">
                {
                    (isLoading && <img alt = "loading" className = "loading-image" src = "img/loader.gif" />) ||
                    chats.map((chat) => renderChat(chat))
                }
                <div ref = {chatBottomRef} />
            </div>
            <div className = "edit-message">
                <MessageBox value = {chatText} onChange = {changeText} onKeyUp={handleKeyUp} />
                {/* <input autofocus type = "text" className = "message-text" placeholder = "Type a message" value = {chatText} onChange = {changeText} onKeyUp={handleKeyUp}/> */}
                <button className = "send-button" onClick = {sendMessage}><span className="material-symbols-outlined">send</span></button>
            </div>
        </div>
    )
}

export default ChatUI;