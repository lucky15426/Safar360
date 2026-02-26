import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const GlobalMusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume] = useState(0.20);

  const playlist = [
    "/aud-1.mp3",
    "/aud-2.mp3",

    "/indian-hindi-song-music-467340.mp3.mpeg",
  ];

  // Pick a random track from the playlist
  const getRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    return playlist[randomIndex];
  };

  // Set initial volume once
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle track ending to play next random one
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const nextTrack = getRandomTrack();
      setCurrentTrack(nextTrack);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // Ensure audio plays when track is set if we are in playing state
  useEffect(() => {
    if (currentTrack && isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Playback prevented:", err.message));
    }
  }, [currentTrack]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // If no track selected yet, pick a random one
        if (!currentTrack) {
          setCurrentTrack(getRandomTrack());
        } else {
          audioRef.current.play();
        }
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play error:", err);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Compacted circular button at top-right */}
      <div className="fixed top-28 right-6 z-50 select-none">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-2xl flex items-center justify-center hover:bg-sky-500/90 transition-all duration-500 hover:scale-110 border border-white/10"
          aria-label={
            isPlaying ? "Pause background music" : "Play background music"
          }
        >
          {isPlaying ? (
            <div className="flex items-center justify-center relative">
              <Volume2 size={16} className="text-sky-400" />
            </div>
          ) : (
            <VolumeX size={16} className="text-white/70" />
          )}
        </button>
      </div>
    </>
  );
};

export default GlobalMusicPlayer;
