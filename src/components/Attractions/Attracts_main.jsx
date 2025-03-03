import React from 'react'
import CardGrids from './CardGrids'

const Attracts_main = (user) => {
  return (
    <>
        <div id='main_title' className='font-poppins m-10 text-center'>
            <h2 className='text-xl mb-3'> Travinity's Guide </h2>
            <p className='text-4xl font-bold mb-5'> Discover Hidden Treasures </p>
            <p className='w-3/4 m-auto'> Embark on captivating journeys through our tales. Ignite your passion for exploration and uncover the world's most enchanting destinations. </p>
        </div>
        <CardGrids user={user.user.user}/>
    </>
  )
}

export default Attracts_main