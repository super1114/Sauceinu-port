import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { getNFTs, shouldApprove, approveSauceInu, mintNFT } from "../hashgraph";
import { Oval } from  'react-loader-spinner'
function BulkTab({pairingData}) {
    const [existingNFTs, setExistingNFTs] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(undefined);
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [buttonTxt, setButtonTxt] = useState(["CONFIRM", "UPLOADING METADATA...", "APPROVING SAUCEINU...", "MINTING..."])
    

    const setNFTSelect = (item) => {
        setSelectedCollection(item);
    }
    
    useEffect(() => {
        const getNFTData = async () => {
            const data = await getNFTs(pairingData.savedPairings[0].accountIds[0]);
            setExistingNFTs(data);
        }
        if(pairingData.savedPairings.length>0) {
            getNFTData();
        }
    },[pairingData])

    
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
  
  export default BulkTab;
  