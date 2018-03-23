import React, {Component} from 'react';
import {Layout, Col, Row} from 'antd';
const {Header, Content, Footer} = Layout;


export default class Base extends Component{

    render(){
        return(
            <div>
                <Layout>
                    <Header></Header>
                    <Content>
                        {
                            this.renderContent()
                        }
                    </Content>
                    <Footer></Footer>
                </Layout>
            </div>
        )
    }
    renderContent(){
        return(
            <div>Please override Content!</div>
        )
    }
}