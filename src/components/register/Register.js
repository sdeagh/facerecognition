import React from 'react';


class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registerEmail: "",
            registerPassword: "",
            registerUsername: ""
        }
    }

    onEmailChange = (event) => {
        this.setState({ registerEmail: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ registerPassword: event.target.value })
    }

    onUsernameChange = (event) => {
        this.setState({ registerUsername: event.target.value })
    }

    onSubmitRegister = (event) => {
        fetch('https://facerecognition-sdesign.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.registerEmail,
                password: this.state.registerPassword,
                username: this.state.registerUsername
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user) {
                this.props.loadUser(user)
                this.props.onRouteChange('home')
            }
        })
    }

    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="username">Username</label>
                                <input onChange={ this.onUsernameChange } 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="username"  
                                    id="username" />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input onChange={ this.onEmailChange } 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input onChange={ this.onPasswordChange } 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password" />
                            </div>
                        </fieldset>
                        <div className="1h-copy mt3">
                            <input 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Register" 
                                onClick={ this.onSubmitRegister }
                            />
                        </div>
                        <div className="lh-copy mt3 pointer">
                            <p onClick={() => this.props.onRouteChange('signin')} className="f6 link dim black db">Sign in</p>
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default Register;