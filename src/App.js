import './App.css';
import 'react-tabs/style/react-tabs.css';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import { pairClient, disconnect } from './hashgraph';
import BulkTab from './components/BulkTab';


function App() {
  const [pairingData, setPairingData] = useState(null);
  const [showDisconnect, setShowDisconnect] = useState(false);


  const connectWallet = async () => {
    const data = await pairClient();
    console.log("DATADATA", data)
    setPairingData(data)
  }
  useEffect(() => {
    connectWallet();
  }, [])

  const disconnectWallet = async () => {
    await disconnect();
    setPairingData(null)
    setShowDisconnect(false)
  }
  return (
    <div className="App" >
      <div className='background-container'>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
      <header>
        <p className="bet-on-title">SAUCEINU-PORT</p>
        
          {pairingData && pairingData.savedPairings && pairingData.savedPairings.length>0 &&
            <div className="toolbar">
              <div onClick={()=> {setShowDisconnect(!showDisconnect)}} className='account-section'>
                <span className="text-green account-text">{pairingData.savedPairings[0].accountIds[0]}</span>
              </div>
              &nbsp;&nbsp;
              <div onClick={()=> {setShowDisconnect(!showDisconnect)}} className='account-section'>
                <span className="text-green account-text">{pairingData.savedPairings[0].accountIds[0]}</span>
              </div>
            </div>
          }
          {(pairingData == null || pairingData.savedPairings == undefined || pairingData.savedPairings.length==0) &&
            <div onClick={()=> connectWallet()} className='account-section'>
              <button className='flip-button'>Connect Wallet</button>
            </div>
          }
        
        {showDisconnect && <div className='disconnect-modal'>
          <button className='disconnect-btn text-green' onClick={() => disconnectWallet()}>Disconnect Account</button>
        </div>}
      </header>
      <main >
        <div className="container">
            <div className='flip-inner-box'>
              {pairingData && 
              <>
                <BulkTab pairingData = {pairingData} />
              </>}
            </div>
        
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
