import React, {Component} from 'react';
import Header from "../../common/header/Header";
import './Home.css'
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Divider,
    FormControl,
    Grid,
    TextField, Typography
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import profilePic from '../../assets/IMG_1150.JPG';
import {red} from '@material-ui/core/colors';
class Home extends Component {

    constructor() {
        super();
        this.state = {
            medias: [],
            individual_media: [],
            likes: [],
            likesCount:[],
            comments: [],
            searchText: '',
            isLoaded:false,
            error:false,
            counter:0,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }

    }

    componentDidMount() {
            this.fetctMediaDetails();
    }

    fetctMediaDetails = () => {
        let url = this.props.baseUrl+"me/media?fields=id,caption,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");
        fetch(url)
         .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              medias: result.data
            });
              let likesCount=[];
              console.log(" media details", this.state.medias)
              this.state.medias.map((details,index)=>{
                  return likesCount.push(7);
              })
              this.setState({'likesCount': likesCount});
            console.log("likes count:" ,this.state.likesCount);
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )

    }

    onFavIconClick = (index) => {
        console.log('likesCounter',this.state.likesCount);
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
        console.log(this.state.likes);
        console.log(this.state.likesCount);
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

    onSearch = (e) => {
        this.setState({'searchText': e.target.value})
        if (this.state.searchText == null || this.state.searchText.trim() === "") {
            let filteredRecentMedia = this.state.medias.filter((element) => {
                return element.caption.text.toUpperCase().split("\n")[0].indexOf(e.target.value.toUpperCase()) > -1
            });
            this.setState({medias: filteredRecentMedia});
            console.log("medias :", this.state.medias)
        }
    }

    render() {
        console.log('logging while rendering',this.state.medias);
        const display= <Container className='posts-card-container'>
            <Grid container spacing={2} alignContent='center' justify='flex-start' direction='row'>
                {
                    (this.state.medias).map((details, index) => {
                        return(
                            <Grid item xs={6} key={details.id}>
                                <Card key={details.id + '_card'}>
                                    <CardHeader
                                        avatar={<Avatar variant="circle" src={profilePic} className='avatar'/>}
                                        title={details.id}
                                        subheader={new Date(details.timestamp).toLocaleString()}/>
                                    <div style={{display: "none"}}>{details.media_type}</div>
                                    <CardMedia style={{height: 0, paddingTop: '56.25%', marginBottom: 5}}

                                               image={details.media_url}/>

                                    <Divider variant="middle" className='divider'/>
                                    <CardContent>
                                        <div
                                            className='post-caption'>{details.caption}</div>

                                        <div className='post-tags'>
                                            {details.username}
                                        </div>
                                        <br/>
                                        <div className='likes'>
                                            {
                                                this.state.likes[index] ?
                                                    <FavoriteIcon fontSize='default' style={{color: red[500]}}
                                                                  onClick={() => this.onFavIconClick(index)}/>
                                                    :
                                                    <FavoriteBorderIcon fontSize='default'
                                                                        onClick={() => this.onFavIconClick(index)}/>
                                            }

                                            <pre> </pre>
                                            <Typography>
                                                <span>{this.state.likesCount[index] + ' likes'}</span>
                                            </Typography>
                                        </div>

                                        <div id='all-comments'>
                                            {
                                                this.state.comments[index] ?
                                                    (this.state.comments)[index].map((comment, index) => (
                                                        <p key={index}>
                                                            <b>{details.username}</b> : {comment}
                                                        </p>
                                                    ))
                                                    :
                                                    <p></p>
                                            }
                                        </div>

                                        <div className='post-comment'>
                                            <FormControl className='post-comment-form-control'>
                                                <TextField id={'textfield-' + index} label="Add a comment"/>
                                            </FormControl>
                                            <div className='add-button'>
                                                <FormControl>
                                                    <Button variant='contained' color='primary'
                                                            onClick={() => this.onAddComment(index)}>ADD</Button>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )})
                }
            </Grid>
        </Container>

            return ( <div>
                <div>
                    <Header loggedIn={this.state.loggedIn} showSearchBox={true}
                            history={this.props.history} profilePic={profilePic}
                            onSearch={this.onSearch}/>
                </div>
                {display}
            </div>
            )
    }
}

export default Home;