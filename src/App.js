import React from 'react';

import Navigation from './Components/Navigation/Navigation'
import Viewbox from './Components/Viewbox/Viewbox'


import './App.css';

const API_ID = process.env.REACT_APP_API_ID
const API_KEY = process.env.REACT_APP_API_KEY
let url='https://cors-anywhere.herokuapp.com/'
url+= `api.adzuna.com/v1/api/property/gb/search/1?app_id=${API_ID}&app_key=${API_KEY}&where=london&category=to-rent&results_per_page=20&content-type=application/json`

class App extends React.Component{

  constructor(){
    super();
    this.state={
<<<<<<< HEAD
      products:[],
    }
  }
=======
      houses:[],
      searchfield: '',
      checkBuy: '',
      checkRent: ''
    }
  }
  
  updateSearch = (e) =>{
    const searchvalue = e.target.value;
    this.setState({searchfield: searchvalue})
}

  submitRequest = (e) =>{ 
    // componentDidMount(){
    e.preventDefault()
    this.fetchHouses(this.state.searchfield).then(houseArr=>this.parseData(houseArr)).then(houses=>{
      this.setState({houses})
      })
  }  


  fetchHouses = (searchParams='') =>{
     return fetch(url)
    .then(res=>res.json())
    .then(data=>data.results)
  }

  parseData = (houseArr) => {
      console.log(houseArr)
      return houseArr.map((house)=>{
      let { title , id, beds, category:{label}, description, 
      image_url, location:{display_name}, postcode, price_per_month} = house;
      return{
        title,
        display_name,
        id,
        description,
        image_url,
        postcode,
        price_per_month,
        beds,
        label,
      }
    })
  }
>>>>>>> Possibly-scrapped


  render(){
  console.log(this.state.houses[0])
  return (
    <div className="App">
      <Navigation/>
      <Viewbox houses={this.state.houses} searchfield={this.state.searchfield}
      updateSearch={this.updateSearch} submitRequest={this.submitRequest}>
          {this.state.houses.length ? (<div className="property">
          <div className="property-top">
            <div className="property-image">
              
              <h1>{this.state.houses[0].display_name}</h1>
              <img src={this.state.houses[0].image_url} alt={this.state.houses[0].title}/>
              <small>{this.state.houses[0].title}</small>
              <p>{this.state.houses[0].description}</p>
            </div>
            <div className="property-description">
              <h1>{this.state.houses[0].price_per_month}</h1>
            </div>
          </div>
          <div className="property-bottom"></div>
       </div>): <div>No bueno</div>}
     
    
      </Viewbox>

  
    </div>
  );
  }
}

export default App;


