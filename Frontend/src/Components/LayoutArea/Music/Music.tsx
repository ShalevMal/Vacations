import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import audioSource from "../../../Assets/Audio/Dirty_Heads_-_Vacation.mp3";
import "./Music.css";

export function Music(): JSX.Element {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    function togglePlay(): void {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }

        setIsPlaying(!isPlaying);
    }

    function handleAudioEnded(): void {
        setIsPlaying(false);
    }

    return (
        <div className="Music">
            <audio
                ref={audioRef}
                src={audioSource}
                loop
                onEnded={handleAudioEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <button className="music-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
    );
}
