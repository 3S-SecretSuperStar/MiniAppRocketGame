import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './component/atom/layoutmain.jsx';
import AppContext from './component/template/AppContext';
import Footer from './component/template/Footer';
import Stars from './component/template/Stars';
import Earned from './pages/Earned';
import Friends from './pages/Friends';
import Help from './pages/Help.jsx';
import Loading from './pages/Loading';
import MainPage from "./pages/MainPage"
import Stats from './pages/Stats';
import UserInfo from './pages/UserInfo';
import Wallet from './pages/Wallet';
import JotaiProvider from "./providers/jotaiProvider"
import { REACT_APP_WS_SERVER } from './utils/privateData.js';
import ReconnectingWebSocket from 'reconnecting-websocket';

const wsServerUrl = REACT_APP_WS_SERVER;

function App() {
  const [isLoading, setLoadingState] = useState(true);
  const [socket, setSocket] = useState();

  const handleLoadingState = (loading) => {
    setLoadingState(loading);
  }

  useEffect(() => {
    const adjustHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  useEffect(() => {
    let socket
    try {
      socket = new ReconnectingWebSocket(wsServerUrl)
      setInterval(()=>{
        socket.send(JSON.stringify({ operation: 'ping' }))
      },10000)  
    } catch (e) {
      //eslint-disable-next-line no-self-assign
      document.location.href = document.location.href
    }
    setSocket(socket);
    return () => socket.close();
  }, [])

  const contextValues = { socket }

  return (
    <AppContext.Provider value={contextValues}>
      <JotaiProvider>
        <div className="App h-screen overflow-hidden flex flex-col relative">

          {!isLoading ?
            (<>
              <Stars />
              <BrowserRouter>
                <Toaster />
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path='/play' element={<MainPage />} />
                  <Route path='/earn' element={<Layout><Earned /></Layout>} />
                  <Route path='/friends' element={<Layout><Friends /></Layout>} />
                  <Route path='/stats' element={<Layout><Stats /></Layout>} />
                  <Route path='/wallet' element={<Layout><Wallet /></Layout>} />
                  <Route path='/userInfo' element={<Layout><UserInfo /></Layout>} />
                  <Route path='/help' element={<Layout><Help /></Layout>} />
                </Routes>

                <Footer />
              </BrowserRouter>
            </>)
            : <Loading setLoading={handleLoadingState} />
          }
        </div>
      </JotaiProvider>
    </AppContext.Provider>
  );
}

export default App;
