import React, {useRef, useEffect } from "react";
import './WriteItem.css';
import ReactSignatureCanvas from 'react-signature-canvas';

/*
    ReactSignatureCanvas 사용을 위해 라이브러리 설치가 필요합니다.
    설치: npm i -S react-signature-canvas
    참고: https://github.com/agilgur5/react-signature-canvas
*/

const WriteItem = ({ position, enterEvent, finishEvent, onAudioPlaying, onScenarioPlay }) => {
    // ReactSignatureCanvas
    const sigCanvas = useRef(null);
    // const [appStyle, setAppStyle] = useState({top: 0, left: 0, width: 0, height: 0, zoom: 1});

    useEffect(() => {
        const resizeWindow = () => {
            const appElement = document.getElementById('App');
            if (appElement) {
                const zoom = 1/window.getComputedStyle(appElement).zoom || 1;

                // setAppStyle({
                //     top: appElement.offsetTop,
                //     left: appElement.offsetLeft,
                //     width: appElement.offsetWidth,
                //     height: appElement.offsetHeight,
                //     zoom: parseFloat(zoom)
                // });

                const canvas = sigCanvas.current.getCanvas();
                const context = canvas.getContext('2d');

                let top = 1000 - position.y - position.height / 2
                let left = 600 + position.x - position.width / 2;

                context.setTransform(zoom, 0, 0, zoom,
                    (appElement.offsetLeft*zoom-appElement.offsetLeft) + (left*zoom-left),
                    (appElement.offsetTop*zoom-appElement.offsetTop) + (top*zoom-top));
            }
        };

        window.addEventListener('resize', resizeWindow);

        resizeWindow();

        return () => window.removeEventListener('resize', resizeWindow);
    }, []);

    const style = {
        left: `${600 + position.x - position.width / 2}px`,
        top: `${1000 - position.y - position.height / 2}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
    };

    const handleEvent = (event) => {
        if(!event) return;

        if (event.eventType === "ScenarioPlay") {
            onScenarioPlay(event.linkGuid);
        } else if (event.eventType === "SoundPlay") {
            onAudioPlaying(event.linkGuid, true);
        }
    };

    return (
        // <div
        //     className="write-item"
        //     style={style}
        //     onMouseUp={() => handleEvent(finishEvent)}
        //     onMouseDown={() => handleEvent(enterEvent)}
        // />
        <ReactSignatureCanvas 
            ref={sigCanvas}
            penColor='black'
            canvasProps={{
                width: style.width,
                height: style.height,
                className: 'write-item',
                style: style,
                onMouseUp: () => handleEvent(finishEvent),
                onMouseDown: () => handleEvent(enterEvent)
            }}
        />
    );
};

export default WriteItem;