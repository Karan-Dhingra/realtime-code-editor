import React, { useCallback, useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { ACTION } from '../hooks/Action'
import { Navigate, useLocation, useParams, useNavigate } from 'react-router-dom'
import { initSocket } from '../hooks/socket';
import { toast } from 'react-hot-toast';

const EditorPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const socket = useRef(null)
    const code = useRef(null)

    const [clients, setClients] = useState([])

    const handleConnectError = useCallback(async(err) => {
        console.log(`Socket Error: `, err)
        toast.error('Socket Connection Failed, try again later.')
        navigate('/')
    }, [navigate])

    const handleNewUserJoined = useCallback(async({clients, username, socketId}) => {
        if(username !== location.state?.username){
            toast.success(`${username} joined the room.`)
            console.log(`${username} joined.`)
        }
        setClients(clients)
        socket.current.emit(ACTION.SYNC_CODE, {code, socketId})
    }, [location.state?.username])

    const handleDisconnected = useCallback(async({username, socketId}) => {
        toast.success(`${username} left the room.`)
        console.log(`${username} Left.`)
        setClients((clients) => (clients.filter((client) => client.socketId !== socketId)))
    }, [])

    // const handleDisconnection = useCallback(async() => {
        // socket.emit('disconnecting')
    // }, [])

    const leaveRoom = () => {
        navigate('/')
    }

    const init = useCallback(async() => {
        socket.current = await initSocket()

        socket.current.on('connect_error', handleConnectError)
        socket.current.on('connect_failed', handleConnectError)
        socket.current.on(ACTION.JOINED, handleNewUserJoined)
        socket.current.on(ACTION.DISCONNECTED, handleDisconnected)

        socket.current.emit(ACTION.JOIN, {
            roomId: params.roomId,
            username: location.state?.username,
        })

        return () => {
            socket.current.disconnect()
            socket.current.off('connect_error', handleConnectError)
            socket.current.off('connect_failed', handleConnectError)
            socket.current.off(ACTION.JOINED, handleNewUserJoined)
            socket.current.off(ACTION.DISCONNECTED, handleDisconnected)
        }
    },[location.state?.username, params.roomId, handleConnectError, handleNewUserJoined, handleDisconnected])

    useEffect(() => {
        init()
    }, [init])

    // useEffect(() => {
    //     window.addEventListener("beforeunload", handleDisconnection);

    //     return () => window.removeEventListener("beforeunload", handleDisconnection);
    // }, [handleDisconnection])

    if(!location.state){
        return <Navigate to='/' />
    }

    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img
                            src='/code-sync.png'
                            alt='code-sync'
                            className='logoImage'
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className='clientsList'>
                        {clients.map((client) => (
                            <Client client={client} key={client.socketId} />
                        ))}
                    </div>
                </div>
                <button className='btn copyBtn' onClick={() => {navigator.clipboard.writeText(params.roomId); toast.success('Copied')}}>COPY ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom} >LEAVE</button>
            </div>
            <div className='editorWrap'>
                <Editor socket={socket} roomId={params.roomId} onCodeChange={(c) => code.current = c} />
            </div>
        </div>
    )
}

export default EditorPage
