import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import Header from '../../common/header/Header';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }
    
    render() {
        if (!this.state.loggedIn) {
            return (
                <Redirect to="/" />
            )
        }
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} showSearchBox={true} history={this.props.history} />
            </div>
        )
    }
}

export default Home;