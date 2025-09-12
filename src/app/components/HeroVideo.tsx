import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5; // slower playback
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src="/videos/pasta-video.mp4"
      className="object-cover opacity-90 w-full h-full absolute inset-0"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
