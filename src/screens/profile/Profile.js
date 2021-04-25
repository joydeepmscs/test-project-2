import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';
import profilePic from '../../assets/IMG_1150.JPG';
import Avatar from '@material-ui/core/Avatar';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {Card,CardContent,CardHeader,CardMedia,Divider,TextField} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {red} from '@material-ui/core/colors';

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
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 600,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    cardMedia:{
        height:400,
        width:500,
        float:'left'
    },
    card:{
        height:'fit-content',
        width:'fit-conent'
    },
    profileMedia:{
        display: '-webkit-box',
        flexDirection: 'column',
    },
    profileMediaAvatar:{
        float:'right'
    },
    profileContent:{
        padding:25
    }
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
            username: '',
            media: [],
            numOfPosts: 0,
            followers: 300,
            following: 250,
            name: 'Joydeep Paul',
            modalIsopen: false,
            mediaModalIsOpen:false,
            individualMedia:'',
            fullName: '',
            fullNameRequired: 'dispNone',
            likes: [],
            likesCount:[],
            comments: [],
            index:0

        };
    }

    componentWillMount() {
        console.log('login',this.props.loginSuccess);
        let url = "https://graph.instagram.com/me/media?fields=id,caption,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");
        const likesCount=[]
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        media: result.data,
                        username:result.data[0].username!==undefined?result.data[0].username:'Joydeep Paul',
                        numOfPosts:result.data.length
                    });
                    this.state.media.forEach((details)=>{
                        likesCount.push(3);
                    })
                    this.setState({'likesCount':likesCount});
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )


    }

    openEditModalHandler = () => {
        this.setState({ modalIsopen: !this.state.modalIsopen })
    }

    closeModalHandler = () => {
        this.setState({ modalIsopen: !this.state.modalIsopen })
    }

    closeMediaModalHandler = () => {
        this.setState({ mediaModalIsOpen: !this.state.mediaModalIsOpen })
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

    openMediaModalHandler=(details)=>{
        console.log(details);
        let updateIndex=0;
        const individualMedia = this.state.media.filter((image,index)=>{
            if(image.id==details)
                return image;
        })[0];
        this.state.media.forEach((image,index)=>{
            if(image.id==details){
                updateIndex=index;
            }
        });
        this.setState({individualMedia:individualMedia,index:updateIndex});
        this.setState({mediaModalIsOpen:!this.state.mediaModalIsOpen});
        //   console.log('Index is',this.state.index);
    }

    onFavIconClick = (index) => {
        let currentLikes = this.state.likes;
        currentLikes[index] = !currentLikes[index];
        let likesCount = this.state.likesCount;
        if(currentLikes[index]){
            likesCount[index]=likesCount[index]+1;
        }else{
            likesCount[index]=likesCount[index]-1;
        }
        this.setState({likesCount:likesCount});
        this.setState({likes: currentLikes});
    }


    onAddComment = (index) => {
        var textfield = document.getElementById("textfield-" + index);
        if (textfield.value == null || textfield.value.trim() === "") {
            return;
        }
        let currentComment = this.state.comments;
        if (currentComment[index] === undefined) {
            currentComment[index] = [textfield.value];
        } else {
            currentComment[index] = currentComment[index].concat([textfield.value]);
        }

        textfield.value = '';

        this.setState({'comments': currentComment})
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
                    <div className={classes.root}>
                        <GridList cellHeight={180} className={classes.gridList}>
                            {this.state.media.map((image) => (
                                <GridListTile cols={0} key={image.id}  style={{ width: '33.3%',cursor:'pointer' }} >
                                    <img onClick={()=>this.openMediaModalHandler(image.id)} src={image.media_url} alt={image.caption} />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
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
                <Modal open={this.state.mediaModalIsOpen} onClose={this.closeMediaModalHandler}
                       className={classes.modal}>

                    <Card key={this.state.individualMedia.id + '_card'} className={classes.card}>
                        <div className={classes.profileMedia}>
                            <div>
                                <CardMedia className={classes.cardMedia} style={{height: 0, paddingTop: '56.25%', marginBottom: 5}} image={this.state.individualMedia.media_url}/>
                            </div>
                            <div className={classes.profileContent}>
                                <CardHeader
                                    avatar={<Avatar variant="circle" src={profilePic}/>}
                                    title={this.state.individualMedia.username}
                                />
                                <Divider variant="middle" className='divider'/>
                                <CardContent>
                                    <div
                                        className='post-caption'>{this.state.individualMedia.caption}</div>

                                    <div className='post-tags' style={{color:'blue'}}>
                                        #fresh
                                    </div>
                                    <br/>
                                    <div id='all-comments'>
                                        {
                                            this.state.comments[this.state.index] ?
                                                (this.state.comments)[this.state.index].map((comment, index) => (
                                                    <p key={index}>
                                                        <b>{this.state.individualMedia.username}</b> : {comment}
                                                    </p>
                                                ))
                                                :
                                                <p></p>
                                        }
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className='likes'>
                                        {
                                            this.state.likes[this.state.index] ?
                                                <FavoriteIcon fontSize='default' style={{color: red[500]}}
                                                              onClick={() => this.onFavIconClick(this.state.index)}/>
                                                :
                                                <FavoriteBorderIcon fontSize='default'
                                                                    onClick={() => this.onFavIconClick(this.state.index)}/>
                                        }

                                        <pre> </pre>
                                        <Typography>
                                            <span>{this.state.likesCount[this.state.index] + ' likes'}</span>
                                        </Typography>
                                    </div>

                                    <div className='post-comment'>
                                        <FormControl className='post-comment-form-control'>
                                            <TextField id={'textfield-' + this.state.index} label="Add a comment"/>
                                        </FormControl>
                                        <div className='add-button'>
                                            <FormControl>
                                                <Button variant='contained' color='primary'
                                                        onClick={() => this.onAddComment(this.state.index)}>ADD</Button>
                                            </FormControl>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(Profile);