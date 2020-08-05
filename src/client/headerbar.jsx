import React from 'react';
import {Link, withRouter} from 'react-router-dom';

export class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
    }

    doLogout = async () => {
        const url = "api/logout";
        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (err) {
            alert("Failed to connect to server: " + err)
            return;
        }

        if (response.status !== 204) {
            alert("Couldnt connect to server: code: " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null);
        this.props.history.push("/");
    };

    renderLoggedIn(userId) {
        return (
            <React.Fragment>
                <p className="header-txt">
                    Welcome {userId} !
                </p>
                <button
                    className="header-btn"
                    onClick={this.doLogout}
                    id="logoutBtnId">
                    Logout
                </button>
            </React.Fragment>
        );
    }

    renderNotLoggedIn() {
        return (
            <React.Fragment>
                <p className="header-txt">
                    Please LogIn or SignUp!
                </p>
                <div className="action-btns">
                    <Link className="header-btn" to="/login" tabIndex="0">
                        LogIn
                    </Link>
                    <Link className="header-btn" to="/signup" tabIndex="0">
                        SignUp
                    </Link>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const userId = this.props.userId;
        let content;
        if (!userId) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }

        return (
            <div className="header">
                <Link className="header-logo" to={"/"} tabIndex="0">
                    Home
                </Link>
                {content}
            </div>
        );
    }
}

export default withRouter(HeaderBar);