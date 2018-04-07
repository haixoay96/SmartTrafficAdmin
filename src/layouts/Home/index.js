import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker ,withScriptjs, Polygon} from "react-google-maps"
import Base from '../Base';
import {Row, Col, Button} from 'antd';
import { deltaLat, deltaLng, topLeft, topRight, bottomLeft, bottomRight} from '../../config';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.region.lat, lng: props.region.lng }}
    center={{ lat: props.region.lat, lng: props.region.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.region.lat, lng: props.region.lng  }} />}
    <Polygon paths={props.paths}/>
    {
        props.squares.map((item, index )=>{''
            return(
                <Polygon
                 key={index} paths={[item.topLeft, item.topRight, item.bottomRight, item.bottomLeft]}
                 options={{
                     fillColor:`rgba(${item.count*8}, ${255-item.count}, 0, 0.8)`,
                     strokeWeight:'0.1'
                 }}
                 />
            )
        })
    }
  </GoogleMap>
))

class List extends Component{
    render(){
        console.log('render')
        return(
            <div style={{
                height:'600px',
                overflowY:'auto',
                margin:10
            }}>
                {
                    this.props.squares2D.map((item,index)=>{
                        return(
                            this.props.renderRow(item)
                        )
                    })
                }
            </div>
        );
    }
    shouldComponentUpdate(){
        return false;
    }
}


export default class Home extends Base{
    constructor(props){
        super(props);
        let squares = this.divideSquares();
       // let squares2D = this.convertTo2Darray(squares);
        this.state ={
            region:{
                lat: 21.1096719,
                lng: 105.7260039
            },
            squares: [],
        }
    }
    componentDidMount(){
        this.getSquares();
    }
    getSquares = ()=>{
        fetch('http://127.0.0.1:3000/location').then((result)=>{
            return result.json();
        }).then((data)=>{
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
                count: item.count
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
    divideSquares = ()=>{
        let point = topLeft;
        let squares = [];
        let unitLat = deltaLat/23.0;
        let unitLng = deltaLng/56.0;
        
        for ( let i = 0 ; i< 23; i++){
            for ( let j = 0 ; j < 56 ;j++){
                let topLeft = {
                    lng:point.lng + unitLng*j,
                    lat:point.lat - unitLat*i
                };
                let topRight = {
                    lng: topLeft.lng + unitLng,
                    lat: topLeft.lat
                };
                let bottomRight = {
                    lng: topRight.lng,
                    lat: topRight.lat - unitLat
                };
                let bottomLeft = {
                    lng: bottomRight.lng - unitLng,
                    lat:bottomRight.lat
                }
                squares.push({
                    topLeft: topLeft,
                    topRight:topRight,
                    bottomRight:bottomRight,
                    bottomLeft:bottomLeft
                });      
            }
        }
        return squares
            
    }
    convertTo2Darray(squares){
        let length = squares.length;
        let newList = [];
        for (let i = 0; i< length ; i+=2 ){
            newList.push({
                one:{
                    index:i+1,
                    data:squares[i]
                },
                two:{
                    index:i+2,
                    data:squares[i+1]
                }
            })
        }
        return newList

    }
    onClickItem = (data)=>{
        this.setState({
            ...this.state,
            region:{
                lat:(data.topLeft.lat + data.topRight.lat +data.bottomRight.lat +data.bottomLeft.lat)/4.0,
                lng:(data.topLeft.lng + data.topRight.lng + data.bottomRight.lng +data.bottomLeft.lng)/4.0
            }
        })

    }
    renderRow = (data)=>{
        return(
            <Row key={data.one.index}>
                <Col span={12}>
                    <Button style={{
                        width:'100%',
                        margin:5
                    }} type="primary"
                    onClick={(e)=>{
                        this.onClickItem(data.one.data)

                    }}
                    >{data.one.index}</Button>
                </Col>
                <Col span={12}>
                    <Button style={{
                        width:'100%',
                        margin:5
                    }} type="primary"
                    onClick={(e)=>{
                        this.onClickItem(data.two.data)
                    }}
                    >{data.two.index}</Button>
                </Col>
            </Row>
        )
    }
    renderList = ()=>{
        return(
            <div style={{
                height:'600px',
                overflowY:'auto',
                margin:10
            }}>
                {
                    this.state.squares2D.map((item,index)=>{
                        return(
                            this.renderRow(item)
                        )
                    })
                }
            </div>
        );
                
    }
    renderContent(){
        return(
            <div>
                <Row>
                    {/* <Col span={6}>
                        <List squares2D={this.state.squares2D} renderRow={this.renderRow} />
                    </Col> */}
                    <Col span={18}>
                        <MyMapComponent
                            isMarkerShown
                            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px`,margin:10,  width:'100%' }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            paths={[topLeft, topRight, bottomRight, bottomLeft]}
                            squares={this.state.squares}
                            region={this.state.region}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}