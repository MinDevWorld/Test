import React, { useState, useCallback, useEffect } from 'react';
import FocusItem from './FocusItem/FocusItem';
import WriteItem from './WriteItem/WriteItem';
import ClickItem from './ClickItem/ClickItem';
import ScenarioPlayer from './ScenarioPlayer/ScenarioPlayer';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import './PageContent.css';
import StartButton from './StartButton/StartButton';
import IndicatorButton from './IndicatorButton/IndicatorButton';
import Speaker from './Speaker/Speaker';
import SubmitButton from './SubmitButton/SubmitButton';
import '../fonts/Font.css';
import titleArrow from '../assets/images/title-arrow.png';
import axios from 'axios';

const PageContent = ({ pageData, sub, step, set }) => {
    
    const page = pageData.pages[0];
    const [background, setBackground] = useState(null);
    const [audioSources, setAudioSources] = useState({}); // 오디오 소스 상태 저장
    const [scenario, setScenario] = useState(page.scenarios[0]);
    const [itemVisibility, setItemVisibility] = useState(() => {
        // 초기 visibility 상태를 설정합니다.
        const initialVisibility = {};
        page.items.forEach(item => {
            initialVisibility[item.guid] = item.isVisible;
        });
        return initialVisibility;
    });

    const [isScenarioRunning, setIsScenarioRunning] = useState(false);
    const [isScenarioEnd, setIsScenarioEnd] = useState(false)
    const [isAudioPlaying, setIsAudioPlaying] = useState({});

    const startScenario = useCallback((newScenario) => {
        setScenario(newScenario);
        setIsScenarioRunning(true);
    }, []);

    const handleStartButtonClick = () => {
        startScenario(page.scenarios[0]); // 첫 번째 시나리오 시작
    };

    const handleClickItemInteraction = useCallback((scenarioGuid) => {
        const newScenario = page.scenarios.find((item) => item.guid === scenarioGuid);
        if (newScenario) {
            startScenario(newScenario);
        }
    }, [page.scenarios, startScenario]);

    const handleItemVisibilityChange = useCallback((itemGuid, isVisible) => {
        setItemVisibility(prev => ({
            ...prev,
            [itemGuid]: isVisible
        }));
    },[]);

    // 시나리오가 끝났을 때 호출될 함수
    const handleScenarioEnd = useCallback(() => {
        console.log("활동 끝")
        setIsScenarioEnd(true);
    }, []);

    const handleScenarioRunning = useCallback((isRunning) => {
        setIsScenarioRunning(isRunning);
    },[]);

    const handleAudioPlaying = useCallback((itemGuid, isPlaying) => {
        setIsAudioPlaying(prev => ({
            ...prev,
            [itemGuid]: isPlaying
        }));
    },[]);

    // page 이미지 파일 경로 찾기
    // const pageImg = pageData.resources[page.pageImg].path;
    // const background = require(`../assets/images/${pageImg}`);
    useEffect(() => {
        // 페이지 이미지 파일 경로 찾기
        const pageImgPath = pageData.resources[page.pageImg].path;
        const imageUrl = `/resource/${sub}/${step}/${set}/Res/Page/${pageImgPath}`;
    
        // Nginx 서버에서 이미지 가져오기
        axios.get(imageUrl, { responseType: 'blob' })
            .then(response => {
                setBackground(URL.createObjectURL(response.data));
            })
            .catch(error => {
                console.error("Error loading image:", error);
            });
    }, [pageData, page, set ,step, sub]);

     // 각 아이템의 이미지와 오디오 리소스 로드
     useEffect(() => {
        page.items.forEach(item => {
            // if (item.type === 'image') {
            //     const imagePath = pageData.resources[item.resourceId].path;
            //     const imageUrl = `/resource/chinese/B/001/Res/Image/${imagePath}`;
                
            //     // 이미지 서버에서 가져오기
            //     axios.get(imageUrl, { responseType: 'blob' })
            //         .then(response => {
            //             setLoadedImages(prevState => ({
            //                 ...prevState,
            //                 [item.guid]: URL.createObjectURL(response.data)  // 각 아이템에 해당하는 이미지 저장
            //             }));
            //         })
            //         .catch(error => {
            //             console.error(`Error loading image for item ${item.guid}:`, error);
            //         });
            // }
            
            if (item.type === 'sound') {
                
                const audioPath = pageData.resources[item.resourceId].path;
                const audioUrl = `/resource/${sub}/${step}/${set}/Res/Audio/${audioPath}`;
                
                // 오디오 서버에서 가져오기
                axios.get(audioUrl, { responseType: 'blob' })
                    .then(response => {
                        setAudioSources(prevState => ({
                            ...prevState,
                            [item.guid]: URL.createObjectURL(response.data) // 오디오 파일 저장
                        }));
                    })
                    .catch(error => {
                        console.error(`Error loading audio for item ${item.guid}:`, error);
                    });
            }
        });
    }, [page.items, pageData, set ,step, sub]);

    return (
        <div className='page' style={{
          backgroundImage: background ? `url(${background})` : 'none'
        }}> 
            <WriteItem position={{x: 0, y: 0, width: 1200, height: 2000}} />
            <div className='title'> 
                <p className='title-1'>{page.title_1}</p>
                <img className='title-arrow' src={`${titleArrow}`} alt='' />
                <p className='title-2'>{page.title_2}</p>
            </div>

            <div className='subTitle'> 
                <p className='subtitle-1'>{page.subtitle_1}</p>
                <p className='subtitle-2'>{page.subtitle_2}</p>
                <p className='subtitle-head'>{page.subtitle_head}</p>
            </div>
           
            {page.items.map(item => {
                
                const isVisible = itemVisibility[item.guid];
                const isPlaying = isAudioPlaying[item.guid];

                if (item.type === 'focus') {
                    return <FocusItem key={item.guid} position={item.position} isVisible={isVisible} focusIndex={item.focusIndex} />;
                } else if (item.type === 'write') {
                    return <WriteItem key={item.guid} position={item.position} enterEvent={item.enterEvent} finishEvent={item.finishEvent} onAudioPlaying={handleAudioPlaying} onScenarioPlay={handleClickItemInteraction}/>;
                } else if (item.type === 'click') {
                    return <ClickItem key={item.guid} position={item.position} isVisible={isVisible} clickEvent={item.clickEvent} onAudioPlaying={handleAudioPlaying} onScenarioStart={handleClickItemInteraction} />;
                } else if (item.type === 'sound'){
                    return <AudioPlayer 
                            key={item.guid} 
                            item={item.guid} 
                            audioSrc={audioSources[item.guid]} 
                            isPlaying={isPlaying} 
                            onAudioPlaying={handleAudioPlaying} 
                        />
                    // return <AudioPlayer key={item.guid} item={item.guid} audioSrc={require(`../assets/audio/${audioSrc}`)} isPlaying={isPlaying} onAudioPlaying={handleAudioPlaying} />
                }
                
                return null;
            })}

            {isScenarioRunning && (
                <ScenarioPlayer
                    scenario={scenario}
                    onItemVisibilityChange={handleItemVisibilityChange}
                    onScenarioEnd={handleScenarioEnd}
                    onScenarioRunning={handleScenarioRunning}
                    onAudioPlaying={handleAudioPlaying}
                />
            )}

            <StartButton onClick={handleStartButtonClick} disabled={isScenarioRunning} />
            <IndicatorButton />
            <Speaker />

            <SubmitButton isScenarioEnd={isScenarioEnd} />


        </div>
    );
};

export default PageContent;