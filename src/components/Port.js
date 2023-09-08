import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { Oval } from  'react-loader-spinner'
import tokens from "../constants";
function Port() {
    const [srcToken, setSrcToken] = useState(undefined);
    const [targetToken, setTargetToken] = useState(undefined);
    const [srcTokens, setSrcTokens] = useState(tokens);
    const [targetTokens, setTargetTokens] = useState(tokens);
    const [step, setStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [buttonTxt, setButtonTxt] = useState(["CONFIRM", "UPLOADING METADATA..."])

    useEffect(() => {
        if(srcToken && srcToken == tokens[0]) {
            const [first, ...rest] = tokens;
            setTargetTokens(rest)
        } else if(srcToken) {
            setTargetTokens([tokens[0]]);
        } 
    }, [srcToken]);

    const setTokenSelect = (item, src) => {
        if(src) setSrcToken(item);
        else setTargetToken(item);
    }
    


    return (
        <>
            <div>
                <Dropdown output={false} tokens={srcTokens} setSelectedToken={(item)=>setSrcToken(item)} />
                <Dropdown output={true} tokens={targetTokens} setSelectedToken={(item)=>setTargetToken(item)} />
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
  