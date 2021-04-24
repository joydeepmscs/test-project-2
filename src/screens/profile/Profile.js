import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';
import profilePic from '../../assets/butterfly.jpg';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
//import Modal from 'react-modal';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    avatar: {
        width: 150,
        height: 150
    },
    editIcon: {
        margin: '10px 0 0 10px',
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: 200,
        padding: 25,
        borderRadius: 4,
        border: 'none'
    }
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
            username: '',
            numOfPosts: 0,
            followers: 300,
            following: 250,
            name: 'Somya Chowdhary',
            modalIsopen: false,
            fullName: '',
            fullNameRequired: 'dispNone'
        };
    }

    componentWillMount() {
        let that = this;
        let user = null;
        let xhrUser = new XMLHttpRequest();
        xhrUser.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    username: JSON.parse(this.responseText).username
                });
            }
        });
        xhrUser.open("GET", this.props.baseUrl + "me?fields=id,username&access_token=" + this.state.accessToken);
        xhrUser.setRequestHeader("Cache-Control", "no-cache");
        xhrUser.send(user);

        let mediaList = null;
        let xhrMediaList = new XMLHttpRequest();
        xhrMediaList.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(JSON.parse(this.responseText));
                that.setState({
                    numOfPosts: JSON.parse(this.responseText).data.length
                });
            }
        });
        xhrMediaList.open("GET", this.props.baseUrl + "me/media?fields=id,caption&access_token=" + this.state.accessToken);
        xhrMediaList.setRequestHeader("Cache-Control", "no-cache");
        xhrMediaList.send(mediaList);
    }

    openEditModalHandler = () => {
        this.setState({ modalIsopen: !this.state.modalIsopen })
    }

    closeModalHandler = () => {
        this.setState({ modalIsopen: !this.state.modalIsopen })
    }

    inputFullNameChangeHandler = (event) => {
        this.setState({ fullName: event.target.value })
    }

    updateHandler = () => {
        if (this.state.fullName === "" ) {
            this.setState({ fullNameRequired: 'dispBlock' })
            return;
        } else {
            this.setState({ fullNameRequired: 'dispNone' });
        }

        this.setState({
            modalIsopen: !this.state.modalIsopen,
            name: this.state.fullName
        })
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <Redirect to="/" />
            )
        }
        const { classes } = this.props;
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} history={this.props.history} />
                <div className="info-section">
                    <Avatar variant="circular" alt="Profile Picture" src={profilePic}
                        className={classes.avatar}></Avatar>
                    <div className="profile-details">
                        <div>
                            <Typography variant="h4">{this.state.username}</Typography>
                        </div>
                        <div className="middle-line">
                            <div>
                                <Typography>
                                    <span>Posts: </span>{this.state.numOfPosts}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <span>Follows: </span>{this.state.following}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <span>Followed By: </span>{this.state.followers}
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography variant="h6">
                                <span>{this.state.name}</span>
                                <Fab size="medium" color="secondary" aria-label="edit"
                                    className={classes.editIcon} onClick={this.openEditModalHandler}>
                                    <EditIcon />
                                </Fab>
                            </Typography>

                        </div>
                    </div>
                </div>
                <div className="image-section">

                </div>
                <Modal open={this.state.modalIsopen} onClose={this.closeModalHandler}
                    className={classes.modal}>
                    <div className={classes.modalContent}>
                        <FormControl className="modal-heading">
                            <Typography variant="h4">
                                Edit
                        </Typography>
                        </FormControl>
                        <br />
                        <br />
                        <FormControl required>
                            <InputLabel htmlFor='fullName'>Full Name</InputLabel>
                            <Input id='fullName' type='text' onChange={this.inputFullNameChangeHandler} />
                            <FormHelperText className={this.state.fullNameRequired}>
                                <span className='required'>required</span>
                            </FormHelperText>
                        </FormControl>
                        <br />
                        <br />
                        <br />
                        <Button variant='contained' color='primary' onClick={this.updateHandler}>
                            UPDATE
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(Profile);