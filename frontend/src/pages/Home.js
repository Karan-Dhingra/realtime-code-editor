/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidV4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')

    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuidV4()
        // console.log(id)
        setRoomId(id)
        toast.success('Created a new room')
    }

    const joinRoom = (e) => {
        e.preventDefault()
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required')
            return
        }

        navigate(`/editor/${roomId}`, {
            state: { username },
        })
    }

    const handleInputEnter = (e) => {
        e.preventDefault()
        if (e.code === 'Enter') {
            joinRoom(e)
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img src='/code-sync.png' alt='code-sync' />
                <h4 className='mainLabel'>Paste Invitation room ID</h4>
                <div className='inputGroup'>
                    <input
                        type='text'
                        placeholder='ROOM ID'
                        className='inputBox'
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type='text'
                        placeholder='USERNAME'
                        className='inputBox'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn joinBtn' onClick={joinRoom}>
                        Join
                    </button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a
                            href=''
                            className='createNewBtn'
                            onClick={createNewRoom}
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home
