import './App.css';
import { useEffect, useState } from 'react';
import { pairClient, disconnect } from './hashgraph';
import Port from './components/Port';
import { useAccount, useConnect, useEnsAvatar, useEnsName } from 'wagmi'

function App() {

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  const { address, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })

  const [pairingData, setPairingData] = useState(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const connectWallet = async () => {
    const data = await pairClient();
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
            {!isConnected&& <div onClick={() => connect({ connector:connectors[0] })} className='account-section'>
              <span className="text-green account-text">
                EVM WALLET
              </span>
            </div>}
            {isConnected&& <div className='account-section'>
              <span className="text-green account-text">
                {address.substring(0,6)+"..."+address.substring(address.length-4)}
              </span>
            </div>}
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
            <Port />  
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
