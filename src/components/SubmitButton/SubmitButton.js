import React from 'react';
import './SubmitButton.css'

const SubmitButton = ({isScenarioEnd}) => {
    // const [isClicked, setIsClicked] = useState(false);

    return (
        <div className='btn-submit' style={{"display": isScenarioEnd ? "block": "none"}}>

        </div>
    )
}

export default SubmitButton