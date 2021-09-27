import { useEffect, useState } from "react";
import useSound from "use-sound";
import Button from "../atomic/button";

export default function SoundButton({ audioFile }: { audioFile: string }): JSX.Element {
    const [isPlaying, setIsPlaying] = useState(false);
    const [togglePlay, { sound, duration }] = useSound(audioFile, {
        id: "test",
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false),
        interrupt: true,
    });

    useEffect(() => {
        return function stopSoundFromPlaying() {
            // This not working for whatever reason!
            // stop("bling"); (this gets extracted from "useSound" hook)
            togglePlay({ id: "test" });
            setIsPlaying(false);
        };
    }, [setIsPlaying]);

    return (
        <div>
            <label>{sound?._src}</label>
            <br />
            <Button type="button" onClick={() => togglePlay()} disabled={isPlaying}>
                {isPlaying ? "Playing" : "Play"}
            </Button>
        </div>
    );
}
