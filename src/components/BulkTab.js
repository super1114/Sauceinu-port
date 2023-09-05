import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import ImageUploading from 'react-images-uploading';
import { NFTStorage, File } from 'nft.storage'
import { ipfskey } from '../config/config';
import { getNFTs, shouldApprove, approveSauceInu, mintNFT } from "../hashgraph";
import { base64ToArrayBuffer } from '../services/helpers';
import { TokenId } from "@hashgraph/sdk";
import { Oval } from  'react-loader-spinner'
function BulkTab({pairingData}) {
    const [images, setImages] = useState([]);
    const [existingNFTs, setExistingNFTs] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(undefined);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creator, setCreator] = useState("");
    const [quantity, setQuantity] = useState(undefined);
    const [step, setStep] = useState(0);
    const [numAttributes, setNumAttributes] = useState(undefined);
    const [attributes, setAttributes] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [buttonTxt, setButtonTxt] = useState(["CONFIRM", "UPLOADING METADATA...", "APPROVING SAUCEINU...", "MINTING..."])

    const onChange = (imageList) => {
        if(step==0) setImages(imageList);
    };

    const uploadMetadata = async () => {
        const imageData = base64ToArrayBuffer(images[0]["data_url"]);
        const file = new File([imageData], images[0].file.name, { type: images[0].file.type });
        const nftstorage = new NFTStorage({ token: ipfskey })
        const { url }  = await nftstorage.store({
            image: file,
            type: images[0].file.type,
            name: name,
            description,
            creator,
            format: 'none',
            attributes:attributes,
        });
        return url;
    }

    const setNFTSelect = (item) => {
        setSelectedCollection(item);
    }
    const updateNumAttributes = (value) => {
        if(parseInt(value)<0) return;
        setNumAttributes(value);
        let newArr = new Array(parseInt(value)).fill({trait_type:"", value: ""});
        setAttributes(newArr);
    }
    const updateAttributes = (index, type, value) => {
        const newValues = attributes.map((item, i) => {
            return i === index ? type=="trait_type"?{trait_type: value, value: item.value}:{trait_type: item.trait_type, value: value} : item;
        });
        setAttributes(newValues);
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

    const proceed = async () => {
        if(selectedCollection==undefined) { setErrorMsg("please select existing collection"); return; }
        if(images.length==0) { setErrorMsg("please select image"); return; }
        if(parseInt(quantity)<=0 ||quantity==undefined) { setErrorMsg("Please enter correct quantity"); return; }
        if(selectedCollection.max_supply - selectedCollection.total_supply<parseInt(quantity)) { setErrorMsg("Quantity exceeded remaining nft number"); return;}
        try {
            if(step==0) {
                setStep(1);
                setErrorMsg("");
                const metadata = await uploadMetadata();
                const approveStatus = await shouldApprove(quantity);
                if(approveStatus) {
                    setStep(2);
                    const approveResult = await approveSauceInu(quantity);
                    setStep(3);
                    const mintResult = await mintNFT(TokenId.fromString(selectedCollection.token_id).toSolidityAddress(), quantity, metadata)
                } else {
                    setStep(3);
                    const mintResult = await mintNFT(TokenId.fromString(selectedCollection.token_id).toSolidityAddress(), quantity, metadata)
                }
                setStep(0);
            }
        } catch (error) {
            setErrorMsg(error.message);
            setStep(0);
        }
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
                <button className="flip-button" tabIndex="0" style={{width:"100%"}} onClick={() => proceed()}>
                    {buttonTxt[step]}
                </button>
            </div>
        </>
    );
  }
  
  export default BulkTab;
  