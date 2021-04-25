import React, { Component } from 'react';
import './Header.css';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import profilePic from '../../assets/IMG_1150.JPG';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
//import {Redirect} from 'react-router-dom';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        backgroundColor: '#DFDFDF',
        padding: 8
    }
})(Menu);

const StyledMenuItem = withStyles(theme => ({
    root: {
        padding: 4,
        minHeight: 'auto',
        '&:focus': {
            backgroundColor: theme.palette.grey,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            }
        }
    }
}))(MenuItem);

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openMenu: false,
            anchorEl: null
        }
    }

    profileIconHandler = (event) => {
        this.setState({ openMenu: !this.state.openMenu, anchorEl: event.currentTarget })
    }

    closeMenu = () => {
        this.setState({ openMenu: !this.state.openMenu, anchorEl: null })
    }

    myAccountHandler = () => {
        this.props.history.push('/profile');
    }

    logoutHandler = () => {
        sessionStorage.removeItem('access-token');
        this.props.history.push('/');
    }

    logoHandler = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <div>
                <header className="app-header">
                    {this.props.loggedIn && this.props.history.location.pathname === '/profile' ?
                        <div onClick={this.logoHandler} className="app-logo-clickable">
                            <span className="app-logo">Image Viewer</span>
                        </div>
                        :
                        <div>
                            <span className="app-logo">Image Viewer</span>
                        </div>}
                    {this.props.loggedIn ?
                        <div className="app-header-right">
                            {this.props.showSearchBox ?
                                <Input type="search" placeholder="Search…" disableUnderline className="search-box"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    } onChange={this.props.searchHandler} /> : ''}
                            <div>
                                <IconButton aria-controls="simple-menu" aria-haspopup="true"
                                    onClick={this.profileIconHandler} style={{ padding: "5px 10px" }}>
                                    <Avatar variant="circular" alt={profilePic} src={profilePic} ></Avatar>
                                </IconButton>

                                <StyledMenu id="simple-menu" open={this.state.openMenu} onClose={this.closeMenu}
                                    anchorEl={this.state.anchorEl} getContentAnchorEl={null}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }} keepMounted>
                                    {this.props.showSearchBox ?
                                        <StyledMenuItem onClick={this.myAccountHandler}>
                                            <Typography>My Account</Typography>
                                        </StyledMenuItem>
                                        : ''}
                                    {this.props.showSearchBox ?
                                        <Divider variant="middle" />
                                        : ''}
                                    <StyledMenuItem onClick={this.logoutHandler}>
                                        <Typography>Logout</Typography>
                                    </StyledMenuItem>
                                    {/* {
                                this.props.showMyAccount ?
                                    <MenuItem onClick={this.onMyAccount}><Typography>My
                                                Account</Typography></MenuItem> : null
                            }
                            {
                                this.props.showMyAccount ?
                                    <Divider variant="middle" /> : null
                            } */}
                                    {/* <MenuItem onClick={this.onLogout}><Typography>Logout</Typography></MenuItem> */}
                                </StyledMenu>

                            </div>
                            {/* {this.props.showSearchBox ?
                            <Input type="search" placeholder="" className="search-box"></Input>
                            : ''
                        } */}

                        </div> : ''}
                </header>
            </div>
        )
    }
}

export default Header;