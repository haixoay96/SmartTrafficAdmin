import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker ,withScriptjs, Polygon} from "react-google-maps"


const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={11}
    defaultCenter={{ lat: 21.1096719, lng: 105.7260039 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 21.1096719, lng: 105.7260039 }} />}
    <Polygon paths={props.paths}/>
  </GoogleMap>
))



export default class Home extends Component{
    constructor(props){
        super(props);
        this.state ={
            region:{
                lat: 21.1096719,
                lng: 105.7260039
            }
        }
    }
    getTop_Left =()=>{
        let position = this.state.region;
        return{
          lat: position.lat + 0.05,
          lng: position.lng - 0.05
        }
    }
    getTop_Right= ()=>{
        let position = this.state.region;
        return{
          lat:position.lat + 0.05,
          lng:position.lng + 0.05
        }
    }
    getBottom_Left =()=>{
        let position = this.state.region;
        return{
          lat:position.lat - 0.05,
          lng:position.lng - 0.05
        }
    }
    getBottom_Right = ()=>{
        let position = this.state.region;
        return{
          lat:position.lat - 0.05,
          lng:position.lng + 0.05
        }
    }
    render(){
        return(
            <div>
                <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px`, width:'50%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    paths={[this.getTop_Left(), this.getTop_Right(), this.getBottom_Right(), this.getBottom_Left()]}
                />
            </div>
            
        )
    }
}