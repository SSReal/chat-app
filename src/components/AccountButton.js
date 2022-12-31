function AccountButton(props) {
    return (
        <div className="account-button">
            <img title = {props.user.displayName} alt = "profile" className = "profile-photo" src = {props.user.photoURL} referrerPolicy="no-referrer"/>
            <button className = "logout-button" onClick = {props.logOut}><span className="material-symbols-outlined">logout</span></button>
        </div>
    )
}

export default AccountButton;