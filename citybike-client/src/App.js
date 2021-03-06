import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";


export  const pin = new Icon({
  iconUrl: '/assets/marcador-de-posicion.svg',
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790662,
      lng: -80.129913,
      zoom:16
    };

  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng];

    const markers = response ? response.map( (station, key) => {
  
      return(<Marker position={[station.latitude, station.longitude]}  icon={pin} key={station.id} >
          <Popup>
            <h3>{station.name}</h3>
            <p>{station.extra.address}</p>
            <ul>
              <li> Cordenadas: {station.latitude} lon: {station.longitude} </li>
              <li>  Disponibles: {station.free_bikes} </li>
            </ul>              
          </Popup>
        </Marker>);  
    }) : '';

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            { markers }
        </Map>
      </div>
    );
  }
}
export default App;
