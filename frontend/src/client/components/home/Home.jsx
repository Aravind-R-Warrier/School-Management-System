import React from 'react'
import Gallery from './gallery/Gallery'
import Carousel from './carousel/Carousel'

function Home() {
  return (
    <div>
      <Carousel/>
      <h1 style={{textAlign:'center',margin:'20px,0px',fontWeight:'800'}}>Registered Schools</h1>
      <Gallery/>
    </div>
  )
}

export default Home
