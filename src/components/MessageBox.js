import { useEffect, useRef } from "react";

function MessageBox(props) {
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    })

    return (
        <input ref = {inputRef} autofocus type = "text" className = "message-text" placeholder = "Type a message" value = {props.value} onChange = {props.onChange} onKeyUp = {props.onKeyUp}/>
    )
}

export default MessageBox;