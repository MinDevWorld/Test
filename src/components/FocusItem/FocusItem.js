import React from 'react'
import './FocusItem.css'

const FocusItem = ({ position, isVisible, focusIndex }) => {
    const className = `focus-item focus-item-${focusIndex}`;
    const style = { 
        left: `${600 + position.x - position.width/2}px`,
        top: `${1000 - position.y - position.height/2}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        display: isVisible ? 'block' : 'none',
    };

    return <div className={className} style={style} />;
};

export default FocusItem