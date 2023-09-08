import './App.css';
import { useEffect, useState, useRef } from 'react';
import { pairClient, disconnect } from './hashgraph';
import Port from './components/Port';
import { useAccount, useConnect } from 'wagmi'
import { FaCopy } from "react-icons/fa";

const useOutsideClick = (callback) => {

  const ref = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);

  return ref;
};

function App() {
  const handleClickOutside = () => {
    setShowDisconnect(false);
  };
  const ref = useOutsideClick(handleClickOutside);
  const { connect, connectors } =
    useConnect()

  const { address, isConnected } = useAccount();

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
  

  const showDisconnModal = () => {
    if(isConnected) setShowDisconnect(true);
  }
  return (
    <div className="App" >
      <div className='background-container'>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
      <header>
        <p className="bet-on-title">SAUCEINU-PORT</p>
          <div className="toolbar" ref={ref}>
            {(pairingData == null || pairingData.savedPairings == undefined || pairingData.savedPairings.length==0) &&
              <>
                <div onClick={()=> connectWallet()} className='account-section'>
                  <span className="text-green account-text">HASHPACK</span>
                </div>
                &nbsp;&nbsp;
              </>
            }
            {pairingData && pairingData.savedPairings && pairingData.savedPairings.length>0 &&
              <>
                <div onClick={showDisconnModal} className='account-section'>
                  <span className="text-green account-text">{pairingData.savedPairings[0].accountIds[0]}</span>
                </div>
                &nbsp;&nbsp;
              </>
            }
            {!isConnected&& <div onClick={() => connect({ connector:connectors[0] })} className='account-section'>
              <span className="text-green account-text">EVM WALLET</span>
            </div>}
            {isConnected&& <div className='account-section' onClick={showDisconnModal}>
              <span className="text-green account-text">
                {address.substring(0,6)+"..."+address.substring(address.length-4)}
              </span>
            </div>}
          </div>
        {showDisconnect && <div className='disconnect-modal' >
          <div className='hashpack-section'>
            <div className='hashpack-address'>
              <span>{pairingData.savedPairings[0].accountIds[0]}</span>
              <FaCopy />
            </div>
            <button className='disconnect-btn text-green' onClick={() => disconnectWallet()}>Disconnect Hashpack</button>
          </div>
          <div className='divider'></div>
          <div className='evm-section'>
            <div className='evm-address'>
              <span>{address.substring(0,6)+"..."+address.substring(address.length-4)}</span>
              <FaCopy />
            </div>
            <button className='disconnect-btn text-green' onClick={() => disconnectWallet()}>Disconnect Metamask</button>
          </div>
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
