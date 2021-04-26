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
            loginCredentials: {
                username: 'admin',
                password: 'admin'
            },
            incorrectCredential: 'dispNone',
            accessToken: 'DkyWEwxc09kQnlIUXd5ZATY3QkFBU1dSY3VqVjQySDFlcTh6UGNaM2hGTXRQVDhNWHRKczZAtQ1BjaTBIaWJucGZArdS16Nkg0Y0FTelR3ZAm5yanFhU29iZA2pJNjQtX1dzRkdGcEU3LUVPalJldwZDZD'
        };
    }

    /**Handler to set state variable 'username' as user enter values on the screen */
    onInputUsernameChange = (event) => {
        this.setState({ username: event.target.value })
    }

    /**Handler to set state variable 'password' as user enter values on the screen */
    onInputPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    /**Handler to login the user if valid credential is entered
     * else throw valid error message
     */
    onLogin = () => {
        this.state.username === '' ? this.setState({ usernameRequired: 'dispBlock' })
            : this.setState({ usernameRequired: 'dispNone' });
        this.state.password === '' ? this.setState({ passwordRequired: 'dispBlock' })
            : this.setState({ passwordRequired: 'dispNone' });
        if (this.state.username === "" || this.state.password === "") {
            this.setState({
                incorrectCredential: 'dispNone'
            });
            return;
        }

        if (this.state.username === this.state.loginCredentials.username
            && this.state.password === this.state.loginCredentials.password) {
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
                {/** Header component included here */}
                <Header />

                {/** Login Card starts */}
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
                                <Input id='username' type='text' onChange={this.onInputUsernameChange} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className='credential-required'>required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className='login-form-control'>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input id='password' type='password' onChange={this.onInputPasswordChange} />
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
                            <Button variant='contained' color='primary' onClick={this.onLogin}>
                                LOGIN
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                {/** Login Card ends */}
            </div>
        )
    }
}

export default Login;