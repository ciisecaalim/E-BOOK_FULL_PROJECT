import React from 'react'

function SidenavList(props) {
  return (
    <div className='flex text-white font-semibold gap-5 pl-5 overflow-hidden  '>
        <i className={`pt-1 fa-solid ${props.icon}`}></i>
        <h1>{props.title}</h1>

    </div>
  )
}

export default SidenavList