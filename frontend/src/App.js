import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import EditorPage from './pages/EditorPage'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <>
            <div>
                <Toaster
                    position='top-right'
                    toastOptions={{
                        success: { theme: { primary: '#4aed88' } },
                    }}
                ></Toaster>
            </div>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    {/* <Route exact path='/editor' element={EditorPage} /> */}
                    <Route path='/editor/:roomId' element={<EditorPage />}
                    />
                </Routes>
            </Router>
        </>
    )
}

export default App
