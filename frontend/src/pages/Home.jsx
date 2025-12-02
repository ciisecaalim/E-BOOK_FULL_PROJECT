import React from 'react'
import HeaderBookStore from '../components/Header'
import HeroBookStore from '../components/Hero'
import BookCard from '../components/Bookcard'
import Footer from '../components/Footer'
import Service from '../components/server'

function Home() {
  return (
    <div>
        <HeaderBookStore/>
        <HeroBookStore/>
   <BookCard />

<Service />
   <Footer/>
 

       



    </div>
  )
}

export default Home