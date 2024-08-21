// src/components/ScenarioPlayer/ScenarioPlayer.js
import {useEffect, useCallback } from 'react';

const ScenarioPlayer = ({ scenario, onItemVisibilityChange, onAudioPlaying, onScenarioRunning, onScenarioEnd }) => {
 
  const updateItemVisibility = useCallback(() => {
    if (!scenario) return;
    scenario.timeline.forEach((timeline) => {
   
      timeline.keyframes.forEach(keyframe => {
        setTimeout(() => {
          if(timeline.type === 'FinishOn'){
            onScenarioEnd()
          }else if (timeline.type === 'FocusOnOff' || timeline.type === 'ClickOnOff') {
            onItemVisibilityChange(timeline.guid, keyframe.value);
          } else if (timeline.type === 'SoundPlay'){
            onAudioPlaying(timeline.guid, true);
          } 
          
        }, keyframe.time * 1000);
      });

    });
    onScenarioRunning(false);
  }, [scenario, onItemVisibilityChange,onAudioPlaying,onScenarioRunning, onScenarioEnd]);

  useEffect(() => {
    updateItemVisibility();
  }, [updateItemVisibility]);
  
  return null;
};


export default ScenarioPlayer;