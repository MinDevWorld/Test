import React, { useCallback } from "react";
import './ClickItem.css';

const ClickItem = ({position, isVisible, clickEvent, onAudioPlaying, onScenarioStart}) => {
    const style = {
        left: `${600 + position.x - position.width/2}px`,
        top: `${1000 - position.y - position.height/2}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        display: isVisible ? 'block' : 'none',
    }

    const updateState = useCallback(() => {
       if(clickEvent.eventType === "SoundPlay"){
            onAudioPlaying(clickEvent.linkGuid, true);
        }else if (clickEvent.eventType === "ScenarioPlay"){
            onScenarioStart(clickEvent.linkGuid);
        }
    },[clickEvent, onAudioPlaying, onScenarioStart]);

    return (
    <div className="click-item" 
        style={style} 
        onClick={ () => {
            updateState();
        }}
    />
    )
}

export default ClickItem