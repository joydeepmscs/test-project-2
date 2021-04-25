import React, { Component } from 'react';
import './Login.css';
import Header from "../../common/header/Header";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            usernameRequired: 'dispNone',
            passwordRequired: 'dispNone',
            credentials: {
                username: 'admin',
                password: 'admin'
            },
            incorrectCredential: 'dispNone',
            accessToken: 'IGQVJXVDkyWEwxc09kQnlIUXd5ZATY3QkFBU1dSY3VqVjQySDFlcTh6UGNaM2hGTXRQVDhNWHRKczZAtQ1BjaTBIaWJucGZArdS16Nkg0Y0FTelR3ZAm5yanFhU29iZA2pJNjQtX1dzRkdGcEU3LUVPalJldwZDZD'
        };
    }

    inputUsernameChangeHandler = (event) => {
        this.setState({ username: event.target.value })
    }

    inputPasswordChangeHandler = (event) => {
        this.setState({ password: event.target.value })
    }

    loginHandler = () => {
        this.state.username === '' ? this.setState({ usernameRequired: 'dispBlock' })
            : this.setState({ usernameRequired: 'dispNone' });
        this.state.password === '' ? this.setState({ passwordRequired: 'dispBlock' })
            : this.setState({ passwordRequired: 'dispNone' });
        if (this.state.username === "" || this.state.password === "") {
            return;
        }

        if (this.state.username === this.state.credentials.username
            && this.state.password === this.state.credentials.password) {
            this.setState({
                incorrectCredential: 'dispNone'
            });
            sessionStorage.setItem('access-token', this.state.accessToken);
            this.props.history.push("/home");
        } else {
            this.setState({
                incorrectCredential: 'dispBlock'
            });
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="login-card-container">
                    <Card className="login-card">
                        <CardContent>
                            <FormControl className='login-form-control'>
                                <Typography variant="h5">
                                    LOGIN
                                </Typography>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className='login-form-control'>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input id='username' type='text' value={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className='credential-required'>required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className='login-form-control'>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input id='password' type='password' onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className='credential-required'>required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormHelperText className={this.state.incorrectCredential}>
                                <span className='credential-required'>Incorrect username and/or password</span>
                            </FormHelperText>
                            <br />
                            <FormControl>
                                <Button variant='contained' color='primary' onClick={this.loginHandler}>
                                    LOGIN
                                </Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;