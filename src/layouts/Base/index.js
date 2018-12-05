import React, {Component} from 'react';
import {Layout, Col, Row, Menu} from 'antd';
const {Header, Content, Footer} = Layout;


export default class Base extends Component{

    render(){
        return(
            <div>
                <Layout>
                    <Header>
                        {/* <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px', right:'0px' }}
                            onClick={(e)=>{
                                if(e.key === '1'){
                                    this.props.history.push('/admin')
                                }
                            }}
                        >
                            <Menu.Item key="1">Dashboard</Menu.Item>
                        </Menu> */}
                    </Header>
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