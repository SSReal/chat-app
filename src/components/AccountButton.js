function AccountButton(props) {
    return (
        <div className="account-button">
            <img className = "profile-photo" src = {props.user.photoURL} referrerPolicy="no-referrer" height={100} />
            <h1>Logged in as {props.user.displayName}</h1>
            <button className = "logout-button" onClick = {props.logOut}>Logout</button>
        </div>
    )
}

export default AccountButton;