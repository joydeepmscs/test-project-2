import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import profilePic from '../../assets/IMG_1150.JPG';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            mediaList: [],
            filteredMediaList: [],
            hashtags: [],
            captions: [],
            likeCountList: [],
            commentList: [],
            commentToBeAdded: [],
            searchText: ''
        }

    }

    componentDidMount() {
        this.fetctMediaDetails();
    }

     fetctMediaDetails = () => {
         let url = this.props.baseUrl + "me/media?fields=id,caption,media_type,media_url,username,timestamp&access_token=" + this.state.accessToken;
         fetch(url)
             .then(resp => {
                 if (resp.status === 200) {

                     resp.json().then(resp => {
                         this.setState({ mediaList: resp.data });
                         console.log("media" + this.state.mediaList);
                         let hashtag = [];
                         let caption = [];
                         let likesCount = [];
                         let comments = [];
                         let toAdd =[];
                         let tempMediaList = this.state.mediaList;
                         tempMediaList.forEach((media, index) => {
                             console.log(media.caption);
                             var hashtags = null;
                             var trimmedCaption = null;
                             if (media.caption) {
                                 hashtags = media.caption.split(' ').filter(str => str.startsWith('#')).join(' ');
                                 trimmedCaption = media.caption.replace(/(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g, '');
                             }
                             // console.log(hashtags);
                             // console.log(trimmedCaption);

                             hashtag.push(hashtags);
                             caption.push(trimmedCaption);

                             var count = 0 + index;
                             if (count > 1) {
                                 likesCount.push({
                                     count: count,
                                     str: 'likes',
                                     userLiked: false
                                 });
                             } else {
                                 likesCount.push({
                                     count: count,
                                     str: 'like',
                                     userLiked: false
                                 });
                             }

                             var totalComments = [];
                             comments.push(totalComments);

                             toAdd.push('');

                         })
                         this.setState({
                             mediaList: tempMediaList,
                             filteredMediaList: tempMediaList,
                             likeCountList: likesCount,
                             commentList: comments,
                             hashtags: hashtag,
                             captions: caption,
                             commentToBeAdded: toAdd
                         });
                         sessionStorage.setItem('likeCountList', JSON.stringify(likesCount));
                         sessionStorage.setItem('commentList', JSON.stringify(comments));
                         console.log(this.state.commentToBeAdded);
                         console.log(toAdd);

                         console.log("likes count:", this.state.likeCountList);
                         console.log("comment list:", this.state.commentList);
                         console.log("hastags list:", this.state.hashtags);
                     });
                 }
             },
                 err => console.log(err)
             )
             .catch(err => console.log(err));
     }

    favIconClickHandler = (likeIdx) => {
        let tempLikeList = this.state.likeCountList;
        tempLikeList.forEach((likeObj, index) => {
            if (index === likeIdx) {
                likeObj.userLiked ? --likeObj.count : ++likeObj.count;
                likeObj.count > 1 ? likeObj.str = 'likes' : likeObj.str = 'like';
                likeObj.userLiked = !likeObj.userLiked;
            }
        });
        this.setState({ likeCountList: tempLikeList });
        sessionStorage.setItem('likeCountList', JSON.stringify(tempLikeList));
    }

    inputCommentChangeHandler = (e, idx) => {
        let temp = this.state.commentToBeAdded;
        temp[idx] = e.target.value;
        this.setState({ commentToBeAdded: temp });
    }

    addCommentHandler = (idx) => {
        let tempList = this.state.commentList;
        let comment = document.getElementById('comment_' + idx);
        let tempComments = tempList[idx];
        tempComments.push({ commentStr: comment.value });
        tempList[idx] = tempComments;
        let temp = this.state.commentToBeAdded;
        console.log(temp);
        temp[idx] = '';
        console.log(temp); 
        this.setState({ commentList: tempList,  commentToBeAdded: temp });
        sessionStorage.setItem('commentList', JSON.stringify(tempList));
        console.log(this.state.commentToBeAdded);
        //console.log(JSON.parse(sessionStorage.getItem('commentList'))[idx]);
        comment.value = '';
    }

    searchHandler = (e) => {
        this.setState({ searchText: e.target.value }, () => {
            console.log("entered : " + this.state.searchText);
            if (!this.state.searchText || this.state.searchText.trim() === "") {
                this.setState({ filteredMediaList: this.state.mediaList });
            } else {
                let filteredMedia = this.state.mediaList.filter((media) => {
                    if (media.caption) {
                        return media.caption.toUpperCase().indexOf(this.state.searchText.toUpperCase()) > -1
                    }
                    return false;
                });
                this.setState({ filteredMediaList: filteredMedia });
            }
        });

    }


    render() {
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} showSearchBox={true} searchHandler={this.searchHandler}
                    history={this.props.history} />
                <div className="media-container">
                    <Grid alignContent='center' container spacing={2} justify='flex-start' direction='row'>
                        {this.state.filteredMediaList.map((media, index) => (
                            <Grid item xs={6} key={"grid_" + media.id}>
                                <Card key={"card_" + media.id} style={{ padding: '0 10px' }}>
                                    <CardHeader
                                        avatar={<Avatar variant="circular" src={profilePic} />}
                                        // titleTypographyProps={{ fontSize: '30px', fontWeight: 'bold' }}
                                        title={media.username}
                                        // subheaderTypographyProps={mediaCardStyles.subheader}
                                        subheader={new Date(media.timestamp).toLocaleString()} />
                                    <CardContent>
                                        <div>
                                            <img src={media.media_url} alt={media.media_url} className="media-img" />
                                        </div>
                                        <div className="media-dtl-divider">
                                            <Divider variant="fullWidth" />
                                        </div>
                                        <div>
                                            <Typography style={{ fontSize: '15px' }}>{this.state.captions[index]}</Typography>
                                            <Typography style={{ fontSize: '15px', color: '#0ab7ff' }}>
                                                {this.state.hashtags[index]}
                                            </Typography>
                                        </div>
                                        <div className="media-icon-section">
                                            {this.state.likeCountList.length > 0 && this.state.likeCountList[index].userLiked ?
                                                <FavoriteIcon style={{ color: red[500], fontSize: 30 }}
                                                    onClick={() => this.favIconClickHandler(index)} />
                                                :
                                                <FavoriteBorderIcon style={{ fontSize: 30 }}
                                                    onClick={() => this.favIconClickHandler(index)} />}
                                            {this.state.likeCountList.length > 0 ?
                                                <Typography style={{ paddingLeft: 15 }}>
                                                    {this.state.likeCountList[index].count + ' ' + this.state.likeCountList[index].str}
                                                </Typography>
                                                : ''}
                                        </div>
                                        <div className="comment-section">
                                            {this.state.commentList.length > 0 && this.state.commentList[index].length > 0 ?
                                                (this.state.commentList[index].map((comment, i) => (
                                                    <p key={'comment_' + index + '_' + i} style={{ margin: '0 0 10px 0' }}>
                                                        <b>{media.username}:</b> {comment.commentStr}
                                                    </p>
                                                )))
                                                : ''}
                                        </div>
                                        <div>
                                            <FormControl style={{ marginRight: 10 }} className='comment-form-control'>
                                                <InputLabel htmlFor={'comment_' + index}>Add a comment</InputLabel>
                                                <Input id={'comment_' + index} type='input'  value=
                                                    {this.state.commentToBeAdded && this.state.commentToBeAdded.length> 0 ? this.state.commentToBeAdded[index] : ''}
                                                    onChange={(e) => this.inputCommentChangeHandler(e, index)} />
                                            </FormControl>
                                            <FormControl style={{ verticalAlign: "bottom" }}>
                                                <Button variant='contained' color='primary'
                                                    onClick={() => this.addCommentHandler(index)}>
                                                    ADD
                                                </Button>
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Home;