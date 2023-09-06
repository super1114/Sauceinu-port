import { useState } from "react";
import Dropdown from "./Dropdown";
import { Oval } from  'react-loader-spinner'
function Port() {
    const [existingNFTs, setExistingNFTs] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(undefined);
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [buttonTxt, setButtonTxt] = useState(["CONFIRM", "UPLOADING METADATA...", "APPROVING SAUCEINU...", "MINTING..."])
    

    const setNFTSelect = (item) => {
        setSelectedCollection(item);
    }

    
    return (
        <>
            <div>
                <Dropdown nfts={existingNFTs} setSelectedNft={setNFTSelect} />
                <Dropdown nfts={existingNFTs} setSelectedNft={setNFTSelect} />
            </div>
            {step!==0 && <div class="loading-spinner">
                <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>}
            <div className='error-message' ><span>{errorMsg}</span></div>
            <div className='box-container'>
                <button className="flip-button" tabIndex="0" style={{width:"100%"}} >
                    {buttonTxt[step]}
                </button>
            </div>
        </>
    );
  }
  
  export default Port;
  