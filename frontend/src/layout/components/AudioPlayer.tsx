import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// handle play/pause logic
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const playAudio = async () => {
			try {
				if (isPlaying) {
					console.log("Attempting to play:", currentSong?.audioUrl);
					await audio.play();
					console.log("Playing successfully");
				} else {
					audio.pause();
				}
			} catch (error) {
				console.error("Error playing audio:", error);
				setError(error instanceof Error ? error.message : "Unknown error");
			}
		};

		playAudio();
	}, [isPlaying, currentSong]);

	// handle song changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong?.audioUrl) {
			console.log("No audio element or URL available");
			return;
		}

		console.log("Loading new song URL:", currentSong.audioUrl);

		const handleCanPlay = () => {
			console.log("Audio can play now");
			if (isPlaying) {
				audio.play().catch(error => {
					console.error("Error in canplay handler:", error);
					setError(error instanceof Error ? error.message : "Unknown error");
				});
			}
		};

		const handleError = (e: ErrorEvent) => {
			console.error("Audio loading error:", e);
			setError(`Failed to load audio: ${e.message}`);
		};

		const isSongChange = prevSongRef.current !== currentSong.audioUrl;
		if (isSongChange) {
			audio.src = currentSong.audioUrl;
			audio.load();
			prevSongRef.current = currentSong.audioUrl;
			
			audio.addEventListener('canplay', handleCanPlay);
			audio.addEventListener('error', handleError);
			
			return () => {
				audio.removeEventListener('canplay', handleCanPlay);
				audio.removeEventListener('error', handleError);
			};
		}
	}, [currentSong, isPlaying]);

	// handle song ends
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			playNext();
		};

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	return (
		<>
			<audio 
				ref={audioRef}
				onLoadStart={() => console.log("Audio loading started")}
				onLoadedData={() => console.log("Audio data loaded")}
			/>
			{error && <div className="text-red-500">{error}</div>}
		</>
	);
};

export default AudioPlayer;