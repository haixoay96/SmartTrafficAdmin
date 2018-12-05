import React,{Component} from 'react';
import Base from '../Base';
import {Row, Col, Button, DatePicker, TimePicker, Popover, Input} from 'antd';


export default class Login extends Base{
    constructor(props){
        super(props);
        let isLogin = localStorage.getItem('isLogin');
        if(isLogin){
            this.props.history.push('/');
        }
        this.state = {
            username: '',
            password: ''
        }
    }
    login = async()=>{
        if(this.state.username === '' || this.state.password === ''){
            alert('Bạn cần nhập đầy đủ thông tin!');
            return;
        }
        if(this.state.username === 'admin' && this.state.password === 'admin'){
            setTimeout(()=>{
                alert('thanh cong')
                this.props.history.push('/');
                localStorage.setItem('isLogin', true);
            },500);
            return;
        }
        setTimeout(()=>{
            alert('Sai username hoặc password!');
        },500);
    }
    renderContent(){
        return(
            <div>
                <Row>
                    <Col span={8} offset={8}>
                        <Input placeholder="Username"   onChange={(e)=>{
                           this.setState({
                               ...this.state,
                               username: e.target.value
                           })
                        }} />
                        <Input placeholder="Password" type="password" target='password' onChange={(e)=>{
                           this.setState({
                            ...this.state,
                            password: e.target.value
                        })
                        }} />
                        <Button type="primary"
                            onClick={(e)=>{
                                this.login();
                            }}
                        >
                            Login
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}