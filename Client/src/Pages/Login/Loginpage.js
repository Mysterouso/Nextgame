import React from 'react';
import { Link } from 'react-router-dom';
import { Usercontext } from '../../Context/Usercontext'

import Loginpageinput from './Loginpageinput'

import { fetchServer } from '../../Utils/Util';

import './Loginpage.css';

const initialErrorState = {
    server:{
        isError: false,
        errorMessage:'',
    },
    password:{
        isError: false,
        errorMessage:'',
    }
}

class Loginpage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            email: '',
            password: '',
            name: '',
            repeatPassword: '',
            error: initialErrorState,
            isLogin: true,
            isRegister: false
        }
    }

    componentDidMount(){
        this.props.monitorNav(false);
    }
    componentWillUnmount(){
        this.props.monitorNav(true);
    }

    errState = (errObj) => {
        this.setState((prevState)=>{
            return({
                        error:{...prevState.error,
                            ...errObj
                        }
                    })
                })
        }

    validateMatch = (e) =>{

        if(this.state.password !== this.state.repeatPassword && this.state.repeatPassword){
            this.errState({password:{
                isError:true,
                errorMessage:"Passwords don't match"
            }
        })
        }
        else if(this.state.password.length>=6) this.setState({error:initialErrorState})
        
    }

    validateLength = (e) =>{
        if(this.state.password.length < 6 && this.state.password){
            this.errState({password:{
                isError:true,
                errorMessage:"Password must be 6 or more characters"
            }})
        }
        else this.setState({error:initialErrorState})
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        this.setState({error:initialErrorState})
        let body;
        let path;
        const { shouldRefresh,updateRefresh,updateUser, redirectLogin} = this.context;

        if(this.state.isLogin){
            body = JSON.stringify({
                email:this.state.email,
                password:this.state.password
            })
            path='/signin'
        }
        else{
            body = JSON.stringify({
                name: this.state.name,
                email:this.state.email,
                password:this.state.password
            })
            path='/register'
        }
        fetchServer(path,body,'POST')
        .then(response=>{
            if(response.user){ return response;}
            else{
                this.setState((prevState)=>{
                    return({
                            error:{
                                ...prevState.error,
                                server:{
                                    isError:true,
                                    errorMessage:response
                                    }
                                }
                            })
                        })
                return Promise.reject(response);
                }
        })
        .then(res=>{
            updateUser(res.user);
            if(shouldRefresh)updateRefresh(false)
            return res
        })
        .then(item=>redirectLogin(true))
        .catch(err=>console.log(err))  
    }

    handleInput = (e) =>{
        const {name,value} = e.target
        this.setState({[name]: value})
    }

    handleCheck = (e) =>{
       
        if(!e.target.checked)return;
       
        this.setState((prevState)=>{
            return{
                email: '',
                password: '',
                name: '',
                repeatPassword: '',
                error: initialErrorState,
                isLogin:!prevState.isLogin,
                isRegister:!prevState.isRegister
            }
        })
    }

    render(){
        const {server,password} = this.state.error;
        
        return(
            <div className="login-correction">
                <div className="login-page">
                    <div className="login">
                        <div className="login-body login--active">
                        
                        <div className="login-divider">
                                <div className="login-partition">
                                    <input checked={this.state.isLogin} onChange={this.handleCheck}type="checkbox"/>
                                    <div>
                                        <h3>Login</h3>
                                    </div>
                                </div>
                                <div className="login-partition login-partition-register">
                                    <input checked={this.state.isRegister} onChange={this.handleCheck} type="checkbox"/>
                                    <div>
                                        <h3>Register</h3>
                                    </div>
                                </div>
                                
                        </div>

                            <form onSubmit={this.handleSubmit}>
                               
                                {server.isError && 
                                    <span className="error-message">{server.errorMessage}</span>
                                }

                                
                                {this.state.isRegister && (
                                     <Loginpageinput inputName="name" inputType="text" inputTitle="Name" handleInput={this.handleInput}
                                      value={this.state.name} key="name" />
                                    )}

                                <Loginpageinput inputName="email" inputType="email" inputTitle="Email" handleInput={this.handleInput}
                                    value={this.state.email} key="email" />
                        
                                <Loginpageinput inputName="password" inputType="password" inputTitle="Password" handleInput={this.handleInput}
                                    value={this.state.password} key="password">
                                 {password.isError && <span className="error-message error-password">{password.errorMessage}</span>}
                                </Loginpageinput>
                            

                                {this.state.isRegister && (
                                      <Loginpageinput inputName="repeatPassword" inputType="password" inputTitle="Confirm your password" handleInput={this.handleInput}
                                      value={this.state.repeatPassword} key="repeatPassword"
                                      blur={this.validateMatch} focus={this.validateLength}/>
                                    )}

                                <input className="login-submit" type="submit" value={this.state.isLogin ? 'Login' : 'Register'}></input>
                            </form>
                            <div className="login-options">
                                {/* <div className="login-to-register">
                                    <h6>Don't have an account?</h6>
                                    <Link to="/register">
                                        <h6>Register here</h6>
                                    </Link>
                                </div> */}
                                <div className="login-to-home">
                                    <h6>Don't want an account?</h6>
                                    <Link to="/">
                                        <h6>Proceed from here</h6>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

Loginpage.contextType = Usercontext;


export default Loginpage;