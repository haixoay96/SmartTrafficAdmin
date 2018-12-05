import React, {Component} from 'react';
import Base from '../Base';



export default class Admin extends Base{
    constructor(props){
        super(props);
        this.state = {
            users: []
        }
    }
    componentDidMount(){
        fetch('http://128.199.90.9:3000/user').then((result)=>{
            return result.json()
        }).then((data)=>{
            if(data.status === 1000){
                this.setState({
                    ...this.state,
                    users:data.users
                })
            }
        })
    }
    renderContent(){
        return(
            <div>
                List user:
                {
                    this.state.users.map((item, index)=>{
                        return(
                            <div key={item.username}>
                                {item.username}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}