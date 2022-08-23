import React from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, LayersControl, LayerGroup, Marker, Popup } from 'react-leaflet';
import './App.css';
import popdens from './layers/MpungeParish_popdens_wgs84.json'
import lakebuffer from './layers/LakeBuffer_wgs84.json'

const PolygonWithText = ({text, pathOptions, coords}) => {
  const center = L.polygon(coords).getBounds().getCenter();
  const context = L.divIcon({html: text.bold(), stype: {height: '0px', width: '0'}});

  return(
    <Polygon positions={coords} pathOptions={pathOptions}>
      <Marker position={center} icon={context} />
    </Polygon>
  )
}

const App = () => {
  const center = [0.10668890079813588, 32.69245172824882]
  const purpleOptions = { color: 'CornflowerBlue' }
  const orangeOptions = { color: 'orange' }

  const test_dot = [{'Year': 2022,'Month': 8,'Date': 16,	
                    'Cooperate_organization':	'Womens group',
                    'Manager':'Daphene', 'Benefit_number':93,
                    'Sponsor':'Elle', 'GPS': [0.103, 32.68]},
                    {'Year': 2021,'Month': 3,'Date': 19,	
                    'Cooperate_organization':	'Womens group',
                    'Manager':'Daphene', 'Benefit_number':83,
                    'Sponsor':'Elle', 'GPS': [0.113, 32.69]}
                  ]

  const parish_popdense = popdens.features.map(d=>d.properties.PopDensKm2)
  const parish_name = popdens.features.map(d=>d.properties.PARISH)

  const darkOptions = (value) => { 
    const v = 255-(parish_popdense[value]/Math.max(...parish_popdense)*255).toString()
    return({color: 'rgb('+v+','+v+','+v+')'})
  }
  
  let parish_multiPolygon = popdens.features.map(d=>d.geometry.coordinates)
  parish_multiPolygon = parish_multiPolygon.map(poly=>poly.map(p=>p.map(coors=>coors.map(c=>[c[1],c[0]]))))

  let lakebuffer_multiPolygon = lakebuffer.features.map(d=>d.geometry.coordinates)
  lakebuffer_multiPolygon = lakebuffer_multiPolygon.map(poly=>poly.map(p=>p.map(coors=>coors.map(c=>[c[1],c[0]]))))

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Water Buffer">
          <Polygon pathOptions={purpleOptions} positions={lakebuffer_multiPolygon} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Popdense">
          <LayerGroup>
            {parish_multiPolygon.map((parish, index)=><Polygon pathOptions={darkOptions(index)} positions={parish}/>)}
          </LayerGroup>
       </LayersControl.Overlay>
       <LayersControl.Overlay name="Parish">
          <LayerGroup>
            {parish_multiPolygon.map((parish, index)=>
              <PolygonWithText text={parish_name[index]} pathOptions={orangeOptions} coords={parish}/>
            )}
          </LayerGroup>
       </LayersControl.Overlay>
       <LayersControl.Overlay name='Pad'>
          <LayerGroup>
          {test_dot.map((dot)=><Marker position={dot.GPS}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>)}
          </LayerGroup>
       </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default App;