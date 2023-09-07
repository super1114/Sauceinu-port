import { useState } from "react";
import Dropdown from "./Dropdown";
import { Oval } from  'react-loader-spinner'
import tokens from "../constants";
function Port() {
    const [selectedCollection, setSelectedCollection] = useState(undefined);
    const [srcToken, setSrcToken] = useState(undefined);
    const [targetToken, setTargetToken] = useState(undefined);
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [buttonTxt, setButtonTxt] = useState(["CONFIRM", "UPLOADING METADATA..."])

    const setTokenSelect = (item, src) => {
        if(src) setSrcToken(item);
        else setTargetToken(item);
    }
    
    return (
        <>
            <div>
                <Dropdown tokens={tokens} setSelectedToken={(item)=>setSrcToken(item)} />
                <Dropdown tokens={tokens} setSelectedToken={(item)=>setTargetToken(item)} />
            </div>
            {step!==0 && <div class="loading-spinner">
                <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
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
  