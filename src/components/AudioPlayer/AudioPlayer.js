// src/components/AudioPlayer/AudioPlayer.js
import React, { useRef, useEffect } from 'react';

const AudioPlayer = ({item, audioSrc, isPlaying, onAudioPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const handleEnded = () => {
    // console.log("오디오 끝")
    onAudioPlaying(item, false)
  }
  return <audio ref={audioRef} src={audioSrc} onEnded={handleEnded} />;
};

export default AudioPlayer;
