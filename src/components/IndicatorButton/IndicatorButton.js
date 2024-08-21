import React from 'react';
import './IndicatorButton.css'

const IndicatorButton = ({onClick, disabled}) => {
    // const [isClicked, setIsClicked] = useState(false);

    return (
    // <div className='btn-start' onClick={()=> {
    <div className= {'btn-indicator'} onClick={()=> {
        // onClick();
        // setIsClicked(true);
    }} disabled = {disabled}></div>
    )
}

export default IndicatorButton