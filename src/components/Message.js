function Message(props) {
    if(props.contentType === "text") {
        if(props.sent) {
            return (
                <div className = "message sent-message">
                    <div className = "sender-title">Me: </div>{props.content}
                </div>
            )
        }
        else {
            return (
                <div className = "message received-message">
                    <div className = "sender-title">{props.displayName}: </div>{props.content}
                </div>
            )
        }
    }
}

export default Message;