import logo from './logo.svg';
import { BrowserRouter,Route ,Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import Editorpage from './pages/Editorpage'
import {Toaster} from 'react-hot-toast';
function App() {
  return (
    <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            success:{
                theme:{
                  primary:'#4aed88',
                },
            },
          }} >
        </Toaster>
      <BrowserRouter>
        <Routes>
          <Route path ='/' element={<Home/>}></Route>
          <Route path = '/editor/:RoomId' element={<Editorpage/>}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
