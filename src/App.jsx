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
import { TonConnectUIProvider } from '@tonconnect/ui-react';

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
      <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
      uiPreferences={{theme: THEME.DARK}}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          },
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"]
          },
          {
            appName: "binanceWeb3TonWallet",
            name: "Binance Web3 Wallet",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
            aboutUrl: "https://www.binance.com/en/web3wallet",
            deepLink: "bnc://app.binance.com/cedefi/ton-connect",
            bridgeUrl: "https://wallet.binance.com/tonbridge/bridge",
            jsBridgeKey: "binancew3w",
            platforms: ["chrome", "safari", "ios", "android"],
            universalLink: "https://app.binance.com/cedefi/ton-connect"
          },
          {
            appName: "fintopio-tg",
            name: "Fintopio Telegram",
            imageUrl: "https://fintopio.com/tonconnect-icon.png",
            aboutUrl: "https://fintopio.com",
            universalLink: "https://t.me/fintopio?attach=wallet",
            bridgeUrl: "https://wallet-bridge.fintopio.com/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"]
          },
          {
            appName: "tokenpocket",
            name: "TokenPocket",
            imageUrl: "https://hk.tpstatic.net/logo/tokenpocket.png",
            aboutUrl: "https://tokenpocket.pro",
            jsBridgeKey: "tokenpocket",
            platforms: ["ios", "android"]
          },
          {
            appName: "dewallet",
            name: "DeWallet",
            imageUrl: "https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png",
            aboutUrl: "https://delabwallet.com",
            universalLink: "https://t.me/dewallet?attach=wallet",
            bridgeUrl: "https://bridge.dewallet.pro/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"]
          },
          {
            appName: "BitgetWeb3",
            name: "BitgetWeb3",
            imageUrl: "https://img.bitgetimg.com/image/third/1723701408284.png",
            aboutUrl: "https://www.bitget.com",
            universalLink: "https://t.me/BitgetOfficialBot?attach=wallet",
            bridgeUrl: "https://ton-connect-bridge.bgwapi.io/bridge",
            platforms: ["ios", "android", "windows", "macos", "linux"]
          },
          {
            appName: "cdcTonWallet",
            name: "Crypto.com DeFi Wallet",
            imageUrl: "https://apro-ncw-api-file.crypto.com/wallet/logo",
            aboutUrl: "https://crypto.com/defi-wallet",
            universalLink: "https://wallet.crypto.com/deeplink/ton-connect",
            deepLink: "dfw://",
            jsBridgeKey: "cdcTonWallet",
            bridgeUrl: "https://wallet.crypto.com/sse/tonbridge",
            platforms: ["ios", "android", "chrome"]
          },
          {
            appName: "tobi",
            name: "Tobi",
            imageUrl: "https://app.tobiwallet.app/icons/logo.png",
            aboutUrl: "https://tobi.fun",
            universalLink: "https://t.me/TobiWalletBot?attach=wallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"]
          },
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/tc_twa_demo_bot/start'
      }}
    >
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
        </TonConnectUIProvider>
      </JotaiProvider>
    </AppContext.Provider>
  );
}

export default App;
