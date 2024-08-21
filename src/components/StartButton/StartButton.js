import React, { useState } from 'react';
import './StartButton.css'

const StartButton = ({onClick, disabled}) => {
    const [isClicked, setIsClicked] = useState(false);

    return (
    // <div className= {isClicked ? 'btn-start clicked': 'btn-start'} onClick={()=> {
    //     onClick();
    //     setIsClicked(true);
    // }} disabled = {disabled}></div>
    <div className= {isClicked ? 'btn-start clicked': 'btn-start'} onClick={()=> {
        onClick();
        setIsClicked(true);
    }} disabled = {disabled}></div>
    )
}

export default StartButton