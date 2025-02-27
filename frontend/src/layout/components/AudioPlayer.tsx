import { usePlayerStore } from "@/stores/usePlayerStore";
import {useEffect, useRef} from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null)
	const prevSongRef = useRef<string | null>(null);

	const{currentSong, isPlaying, playNext}=usePlayerStore()

	//handle play/pause logic
	useEffect(() =>{
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause()
		console.log("la logica play/pause funciona")
	}, [isPlaying]);

	//handle song ends
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext()
		}

		audio?.addEventListener("ended", handleEnded)
		console.log("la logica de songend funciona")

		return () => audio?.removeEventListener("ended", handleEnded)
	}, [playNext]);

	//handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		//revisa si es una canción nueva
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if(isSongChange){
			audio.src = currentSong?.audioUrl;

			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;
			if(isPlaying) audio.play();

			console.log("la logica de si es una canción nueva funciona")
		}
		console.log("la logica de song changes funciona")
	}, [currentSong, isPlaying])

  	return <audio ref={audioRef}/>
}

export default AudioPlayer