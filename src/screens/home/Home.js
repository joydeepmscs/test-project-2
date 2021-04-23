import React, {Component} from 'react';
import './Home.css';
import Header from '../../common/header/Header';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            image: {
                id: "",
                url: ""
            }
        }
    }

    componentWillMount() {
        let that = this;
        let dataMovie = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({movie: JSON.parse(this.responseText)});
            }
        })

        xhrMovie.open("GET", this.props.baseUrl + "movies/" + this.props.match.params.id);
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(dataMovie);

    }

    render() {
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} showSearchBox={true} history={this.props.history}/>
            </div>
        )
    }
}

export default Home;