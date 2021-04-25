import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';
import profilePic from '../../assets/IMG_1150.JPG';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
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
import Divider from '@material-ui/core/Divider';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';

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
        alignItems: 'center',
        justifyContent: 'center'
    },
    backDrop: {
        background: 'rgba(255,255,255,0.5)',
    },
    editModalContent: {
        backgroundColor: 'white',
        width: 200,
        padding: 25,
        borderRadius: 4,
        border: '2px solid grey'
    },
    mediaModalContent: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: 800,
        padding: 25,
        borderRadius: 4,
        border: '2px solid grey'
    }
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
            likeCountList: JSON.parse(sessionStorage.getItem('likeCountList')),
            commentList: JSON.parse(sessionStorage.getItem('commentList')),
            username: '',
            numOfPosts: 0,
            followers: 300,
            following: 250,
            name: 'Joydeep Paul',
            editModalIsopen: false,
            mediaModalIsopen: false,
            fullName: '',
            fullNameRequired: 'dispNone',
            mediaDetailList: [],
            likesCount: 0,
            selecetedMedia: {},
            selectedIndex: null,
            selectedHashTags: null,
            error: '',
            comment: ''
        };
    }

    componentDidMount() {
        this.fectchUserName();
        this.fetchMediaDetails();
    }

     fectchUserName = () => {
         let url = this.props.baseUrl + "me?fields=id,username&access_token=" + this.state.accessToken;
         fetch(url)
             .then(resp => {
                 if (resp.status === 200) {
                     resp.json().then(resp => {
                         console.log(resp);
                         this.setState({ username: resp.username })
                     });
                 }
             },
                 err => console.log(err)
             )
             .catch(err => console.log(err));
     }

     fetchMediaDetails = () => {
         let url = this.props.baseUrl + "me/media?fields=id,caption,media_type,media_url,username,timestamp&access_token=" + this.state.accessToken;
         fetch(url)
             .then(resp => resp.json())
             .then(
                 (result) => {
                     this.setState({
                         mediaDetailList: result.data
                     });
                     let likesCount = [];
                     console.log(" media details", this.state.mediaDetailList)
                     this.state.mediaDetailList.forEach((media, index) => {
                         likesCount.push(150 + index);
                     })
                     this.setState({ 'likesCount': likesCount });
                     console.log("likes count:", this.state.likesCount);
                 },
                 (error) => {
                     this.setState({ error: error });
                 }
            )
     }

    openEditModalHandler = () => {
        this.setState({ editModalIsopen: !this.state.editModalIsopen })
    }

    closeEditModalHandler = () => {
        this.setState({ editModalIsopen: !this.state.editModalIsopen })
    }

    inputFullNameChangeHandler = (event) => {
        this.setState({ fullName: event.target.value })
    }

    updateHandler = () => {
        if (this.state.fullName === "") {
            this.setState({ fullNameRequired: 'dispBlock' })
            return;
        } else {
            this.setState({ fullNameRequired: 'dispNone' });
        }

        this.setState({
            editModalIsopen: !this.state.editModalIsopen,
            name: this.state.fullName
        })
    }

    openMediaModalHandler = (mediaId) => {
        var idx = 0;
        var media = this.state.mediaDetailList.filter((media, index) => {
            if (media.id === mediaId) {
                idx = index;
                return true;
            }
            return false;
        })[0];
        if (media.caption) {
            var hashtags = media.caption.split(' ').filter(str => str.startsWith('#')).join(' ');
            media.caption = media.caption.replace(/(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g, '');
        }

        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen,
            selecetedMedia: media,
            selectedIndex: idx,
            selectedHashTags: hashtags,
        });
        console.log(this.state.commentList[idx].length);
    }

    closeMediaModalHandler = () => {
        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen
        })
    }

    favIconClickHandler = () => {
        let tempLikeList = this.state.likeCountList;
        tempLikeList.forEach((likeObj, index) => {
            if (index === this.state.selectedIndex) {
                likeObj.userLiked ? --likeObj.count : ++likeObj.count;
                likeObj.count > 1 ? likeObj.str = 'likes' : likeObj.str = 'like';
                likeObj.userLiked = !likeObj.userLiked;
                console.log(likeObj);
            }
        });
        console.log(tempLikeList);
        this.setState({ likeCountList: tempLikeList });
    }

    inputCommentChangeHandler = (e) => {
        this.setState({ comment: e.target.value });
    }

    addCommentHandler = () => {
        let tempList = this.state.commentList;
        console.log(tempList);
        let tempComments = tempList[this.state.selectedIndex];
        tempComments.push({ commentStr: this.state.comment });
        tempList[this.state.selectedIndex] = tempComments;
        this.setState({ commentList: tempList, comment: '' });
        document.getElementById('comment').value = '';
        //sessionStorage.setItem('commentList', JSON.stringify(tempList));
        console.log(tempList[this.state.selectedIndex]);
        //console.log(JSON.parse(sessionStorage.getItem('commentList'))[idx]);
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
                    <GridList cols={3} cellHeight={450} style={{cursor:"pointer"}} >
                        {this.state.mediaDetailList.map(media => (
                            <GridListTile onClick={() => this.openMediaModalHandler(media.id)} className="released-movie-grid-item"
                                key={"grid_" + media.id}>
                                <img src={media.media_url} alt={media.caption} />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <Modal open={this.state.editModalIsopen} onClose={this.closeEditModalHandler}
                    BackdropProps={{
                        classes: {
                            root: classes.backDrop
                        }
                    }}
                    className={classes.modal}>
                    <div className={classes.editModalContent}>
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
                <Modal open={this.state.mediaModalIsopen} onClose={this.closeMediaModalHandler} className={classes.modal}>
                    <div className={classes.mediaModalContent}>
                        <div className="image-modal-left">
                            <img src={this.state.selecetedMedia.media_url} alt={this.state.selecetedMedia.media_url}
                                className="modal-media-img" />
                        </div>
                        <div className="image-modal-right">
                            <div className="media-header">
                                <Avatar variant="circular" alt="Profile Picture" src={profilePic}></Avatar>
                                <Typography variant="h4" style={{ paddingLeft: '10px' }}>{this.state.selecetedMedia.username}</Typography>
                            </div>
                            <div className="media-dtl-divider">
                                <Divider variant="fullWidth" />
                            </div>
                            <div className="media-caption">
                                <Typography style={{ fontSize: '14px' }}>{this.state.selecetedMedia.caption}</Typography>
                                <Typography style={{ fontSize: '14px', color: '#0ab7ff' }}>{this.state.selectedHashTags}</Typography>
                            </div>
                            <div className="modal-comment-section">
                                {this.state.commentList[this.state.selectedIndex] && this.state.commentList[this.state.selectedIndex].length > 0 ?
                                    (this.state.commentList[this.state.selectedIndex].map((comment, i) => (
                                        <p key={'comment_' + this.state.selectedIndex + '_' + i} style={{ margin: '0 0 6px 0' }}>
                                            <b>{this.state.selecetedMedia.username}:</b> {comment.commentStr}
                                        </p>
                                    )))
                                    : ''}
                            </div>
                            <div className="modal-media-icon-section">
                                {this.state.likeCountList[this.state.selectedIndex]
                                    && this.state.likeCountList[this.state.selectedIndex].userLiked ?
                                    <FavoriteIcon fontSize='default' style={{ color: red[500], fontSize: 30 }}
                                        onClick={() => this.favIconClickHandler()} />
                                    :
                                    <FavoriteBorderIcon style={{ fontSize: 30 }}
                                        onClick={() => this.favIconClickHandler()} />}
                                {this.state.likeCountList[this.state.selectedIndex] ?
                                    <Typography style={{ paddingLeft: 15, fontSize: 14 }}>
                                        {this.state.likeCountList[this.state.selectedIndex].count + ' '
                                            + this.state.likeCountList[this.state.selectedIndex].str}
                                    </Typography>
                                    : ''}
                            </div>
                            <div>
                                <FormControl style={{ marginRight: 10 }} className='modal-comment-form-control'>
                                    <InputLabel htmlFor='comment'>Add a comment</InputLabel>
                                    <Input id='comment' type='text' value={this.state.comment}
                                        onChange={this.inputCommentChangeHandler} />
                                </FormControl>
                                {/* <FormControl style={{ marginRight: 10 }} className='modal-comment-form-control'>
                                    <TextField id="comment" value={this.state.comment} label="Add a comment" onChange={this.inputCommentChangeHandler} />
                                </FormControl> */}
                                <FormControl style={{ verticalAlign: "bottom" }}>
                                    <Button variant='contained' color='primary'
                                        onClick={this.addCommentHandler}>
                                        ADD
                                    </Button>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default withStyles(styles)(Profile);