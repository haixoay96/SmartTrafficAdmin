import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker ,withScriptjs, Polygon} from "react-google-maps"
import Base from '../Base';
import {Row, Col, Button, DatePicker, TimePicker, Popover} from 'antd';
import { deltaLat, deltaLng, topLeft, topRight, bottomLeft, bottomRight} from '../../config';
import moment from 'moment';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.region.lat, lng: props.region.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.region.lat, lng: props.region.lng  }} />}
    <Polygon paths={props.paths}/>
    {
        props.squares.map((item, index )=>{''
            return(
                <Polygon
                 key={index} paths={[item.topLeft, item.topRight, item.bottomRight, item.bottomLeft]}
                 options={{
                     fillColor:`rgba(${(item.count/5)*255 },${255}, 0, 0.8)`,
                     strokeWeight:'0.01'
                 }}
                //  onClick={(e)=>{
                //      props.hover(index),
                //      console.log('in', index)
                //  }}
                 onMouseOver={(e)=>{
                    console.log('over', index);
                    props.hover(index);
                 }}
                 />
            )
        })
    }
  </GoogleMap>
))




export default class Home extends Base{
    constructor(props){
        super(props);
        let isLogin = localStorage.getItem('isLogin');
        if(!isLogin){
            this.props.history.push('/login');
        }
       // let squares2D = this.convertTo2Darray(squares);
       let now = new Date();
        this.state ={
            region:{
                lat: 21.1096719,
                lng: 105.7260039
            },
            squares: [],
            date : moment(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, 'YYYY-MM-DD'),
            time: moment(`${now.getHours()}:${now.getMinutes()}`, 'HH:mm'),
            infor: -1
        }
    }
    componentDidMount(){
        this.getSquares();
    }
    hover = (index)=>{
        this.setState({
            ...this.state,
            infor:index
        })
    }
    getSquares = ()=>{
        console.log(this.state.date.date())
        fetch('http://128.199.90.9:3000/density', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: this.state.date.year(),
                month: this.state.date.month(),
                date:this.state.date.date(),
                hour: this.state.time.hour(),
                minute: this.state.time.minute()
            })
        }).then((result)=>{
            return result.json();
        }).then((data)=>{
            console.log(data)
            if(data.status === 1002){
                alert('Không có dữ liệu');
                this.setState({
                    ...this.state,
                    squares:[]
                  })
                return;
            }
            if(data.status === 1001){
                alert('Lỗi hệt thống!');
                return;
            }
          let squares = data.squares;
          squares = squares.map((item)=>{
              return{
                  topLeft: {
                      lat: item.topLeft.latitude,
                      lng: item.topLeft.longitude
                  },
                  topRight:{
                    lat: item.topRight.latitude,
                    lng: item.topRight.longitude
                },
                bottomRight:{
                    lat: item.bottomRight.latitude,
                    lng: item.bottomRight.longitude
                },
                bottomLeft:{
                    lat: item.bottomLeft.latitude,
                    lng: item.bottomLeft.longitude
                },
                count: item.count,
                speed: item.speed
              }
          })
          this.setState({
            ...this.state,
            squares:squares
          })
        }).catch((e)=>{
          console.log(e)
        });

    }
    renderContent(){
        return(
            <div>
                <Row>
            
                    <Col span={18}>
                        <DatePicker 
                            defaultValue={this.state.date}
                            onChange={(e)=>{
                            let date = e.date();
                            let month = e.month();
                            let year = e.year();
                            this.setState({
                                ...this.state,
                                date:  moment(`${year}-${month+1}-${date}`, 'YYYY-MM-DD'),
                            })
                            setTimeout(()=>{
                                this.getSquares();

                            },0)
                            console.log(date, month, year)
                        }}  format={'DD/MM/YY'} />
                        <TimePicker 
                            defaultValue={this.state.time} 
                            format={'HH:mm'}
                            onChange={(e)=>{
                                let hour = e.hour();
                                let minute = e.minute();
                                this.setState({
                                    ...this.state,
                                    time: moment(`${hour}:${minute}`, 'HH:mm')
                                })
                                setTimeout(()=>{
                                    this.getSquares();
    
                                },0)
                                console.log(hour, minute)
                            }} 
                        />
                        <MyMapComponent
                            isMarkerShown
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD9mxstBQCo75o1-rkeMA6GwwQVCzAdveo&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px`,margin:10,  width:'100%' }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            paths={[topLeft, topRight, bottomRight, bottomLeft]}
                            squares={this.state.squares}
                            region={this.state.region}
                            hover={this.hover}
                        />
                    </Col>
                     <Col span={2}>
                        {
                            this.state.infor !==-1?(
                                <Popover visible={true} content={(
                                    <p>
                                        position:<br/>
                                        +lat:{this.state.squares[this.state.infor].topLeft.lat}<br/>
                                        +lng:{this.state.squares[this.state.infor].topLeft.lng}<br/>
                                        +count:{this.state.squares[this.state.infor].count}<br/>
                                        +speed:{this.state.squares[this.state.infor].speed}
                                    </p>
                                )} title="Thông tin vị trí">
                                    <Button onClick={(e)=>{
                                        this.setState({
                                            ...this.state,
                                            infor:-1
                                        })
                                    }} type="primary">Hidden infor</Button>
                                </Popover>
                            ):null
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}