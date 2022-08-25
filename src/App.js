import React from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, LayersControl, LayerGroup, Marker, Popup } from 'react-leaflet';
import './App.css';
import popdens from './layers/MpungeParish_popdens_wgs84.json'
import lakebuffer from './layers/LakeBuffer_wgs84.json'

const PolygonWithText = ({text, pathOptions, coords}) => {
  const center = L.polygon(coords).getBounds().getCenter();
  const context = L.divIcon({html: text.bold(), iconSize: "auto",});

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


  const test_dot = [{'type': 'Pad','Year': 2022,'Month': 8,'Date': 16,	
                    'Cooperate_organization':	'Womens group',
                    'Manager':'Daphene', 'Benefit_number':93,
                    'Sponsor':'Elle', 'GPS': [0.103, 32.68], 'img':"https://saizi-production.imgix.net/KE.WHH.1H.20.358/009/KE.WHH.1H.20.358-9-b9fc3d1b4b496ab32142a8bb89b33faa059b15bd.jpg?auto=format&h=500"},
                    {'type': 'Pad', 'Year': 2021,'Month': 3,'Date': 19,	
                    'Cooperate_organization':	'Womens group',
                    'Manager':'Daphene', 'Benefit_number':83,
                    'Sponsor':'Elle', 'GPS': [0.113, 32.69], 'img':"https://saizi-production.imgix.net/UG.WHH.1H.20.363/099/UG.WHH.1H.20.363-99-4b182bdf4cacc26be4cf60b97ad04bd31e4862ff.jpg?auto=format&h=500"}
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


  // const icon = L.icon.glyph({

    // className: '',
    // Akin to the 'className' option in L.DivIcon
  
    // prefix: 'mif',
    // CSS class to be used on all glyphs and prefixed to every glyph name
  
    // glyph: 'earth',
    // Name of the glyph
  
    // glyphColor: 'white',
    // Glyph colour. Value can be any string with a CSS colour definition.
  
    // glyphSize: '11px',
    // Size of the glyph, in CSS units
  
    // glyphAnchor: [0, 7],
    // Position of the center of the glyph relative to the center of the icon.
  
    // bgPos: [0, 0],
    // Akin to the 'bgPos' option in L.DivIcon. Use when using a sprite for the
    // icon image.
  
    // bgSize: [800, 100]
    // Forces the size of the background image. Use when using a sprite for the
    // icon image in "retina" mode.
  // }); 
  // const Icon = L.icon.glyph({ prefix: 'mdi', glyph: 'school' });
  // console.log('Icon:', {Icon});
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
            <Popup className="popupCustom">
              <div><h2>{dot.type}</h2><h5 style={{margin:'0'}}>Date</h5> <p style={{margin:'0', marginBottom:'5px'}}>{dot.Year}/{dot.Month}/{dot.Date}</p></div>
              <div><h5 style={{margin:'0'}}>Cooperate Organization</h5> <p style={{margin:'0', marginBottom:'5px'}}>{dot.Cooperate_organization}</p></div>
              <div><h5 style={{margin:'0'}}>Manager</h5> <p style={{margin:'0', marginBottom:'5px'}}>{dot.Manager}</p></div>
              <div><h5 style={{margin:'0'}}>Benefit_number</h5> <p style={{margin:'0', marginBottom:'5px'}}>{dot.Benefit_number}</p></div>
              <div><h5 style={{margin:'0'}}>Sponsor</h5> <p style={{margin:'0', marginBottom:'5px'}}>{dot.Sponsor}</p></div>
              <br/><img src={dot.img} width="215px"/>
              {console.log('dot.img',dot.img)}
            </Popup>
          </Marker>)}
          </LayerGroup>
       </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default App;