import React, { useState } from 'react';
import PolygonIcon from '../assets/images/Polygon.svg';
import PolygonIconUp from '../assets/images/Polygon_up.svg';
import token from '../assets/images/token.png';

const useOutsideClick = (callback) => {
  const ref = React.useRef();
  React.useEffect(() => {
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

export default function Dropdown({output, tokens, setSelectedToken}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const toggling = () => setIsOpen(!isOpen);
  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    setSelectedToken(value);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  return (
    <div className='box-container' ref={ref}>
      <div
        className={isOpen ? 'select_token_click select_token' : 'select_token'}
      >
        <input className='text-input' disabled={output} type='number' placeholder='0.000000'/>
        <div className='select-combo' onClick={toggling}>
          {selectedOption && <>
            <div className='token-img-group'>
              <img src={token} alt='coin' className='token-image' />&nbsp;
              <img src={selectedOption.avatar} alt='coin' className='blockchain-image' />&nbsp;
            </div>
              <span >{`[${selectedOption.symbol}]`}</span>
            </>
          }
          {!selectedOption && <span>SELECT</span>} &nbsp;
          <img src={isOpen ? PolygonIconUp : PolygonIcon} alt="icon" />
        </div>
      </div>
      {isOpen && (
        <div className="dropdown_list_container">
          <ul className="dropdown_list">
            {tokens.map((option, key) => (
              <li key={key} onClick={onOptionClicked(option)}>
                <div className='option-img-group'>
                  <img src={token} alt="token" className='dropdown-img'/>
                  <img src={option.avatar} alt="token" className='option-network-img'/>
                </div>
                &nbsp;&nbsp;
                SAUCEINU
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}