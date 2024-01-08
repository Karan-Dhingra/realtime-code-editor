import React from 'react'
import Avatar from 'react-avatar'

const Client = ({ client }) => {
    return (
        <div className='client'>
            {/* AVATAR */}
            <Avatar name={client.username} size={50} round='14px' />
            <span className='userName'>{client.username}</span>
            {/* USERNAME */}
        </div>
    )
}

export default Client
