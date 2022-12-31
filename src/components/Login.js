

function Login(props) {
    return (
        <button className = "login-button" onClick = {props.logIn}><span className="material-symbols-outlined">
        login
        </span> Login</button>
    )
}

export default Login;