import React from 'react';
import {Link} from 'react-router-dom';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }

    render() {
        const user = this.props.user;

        return(
            <div className="home-content">
                <h2 className="heading">Welcome to the auction house!</h2>
                <p>
                    //TODO
                </p>
                <p>Active auctioneers: {this.props.userCount}</p>
                {user ? (
                    <div>
                        //TODO to display for a logged inn user
                    </div>
                ) : (
                    <p>Login to access more auctioneer-options!</p>
                )}
            </div>
        );
    }
}