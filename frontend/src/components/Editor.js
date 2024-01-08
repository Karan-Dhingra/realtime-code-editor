import React, { useCallback, useRef } from 'react'
import { useEffect } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import { ACTION } from '../hooks/Action'

const Editor = ({socket, roomId, onCodeChange}) => {
    const editorRef = useRef(null)

    const init = useCallback(() => {
        editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
            mode: { name: 'javascript', json: true },
            theme: 'dracula',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        })

        editorRef.current.on('change', (instance, changes) => {
            const {origin} = changes
            const code = instance.getValue()
            onCodeChange(code)
            if(origin !== 'setValue'){
                socket.current.emit(ACTION.CODE_CHANGE, {
                    roomId,
                    code
                })
            }
        })

    }, [socket, roomId, onCodeChange])

    const handleCodeChange = useCallback(async({code}) => {
        if(code !== null){
            editorRef.current.setValue(code)
        }
    }, [])

    useEffect(() => {
        if(!socket.current) return

        socket.current?.on(ACTION.CODE_CHANGE, handleCodeChange)

        return () => {
            socket.current?.off(ACTION.CODE_CHANGE, handleCodeChange)
        }
    }, [socket.current])

    useEffect(() => {
        init()
    }, [init])

    return <textarea id='realtimeEditor'></textarea>
}

export default Editor
