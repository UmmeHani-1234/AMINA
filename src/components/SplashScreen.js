import { useState, useEffect, useRef } from "react";

const VIDEO_SOURCES = [
  "/img/iss-timelapse.mp4",
  "/img/recording-3.mp4",
  "/img/rover-screen-recording.mp4",
  "/img/videoplayback (1).mp4",
  "/img/videoplayback (2).mp4",
  "/img/videoplayback (3).mp4",
];

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(15);

  useEffect(() => {
    let mounted = true;
    let completedVideos = 0;
    const totalVideos = VIDEO_SOURCES.length;

    // Create background video preloaders (metadata only to prevent downloading ~95MB upfront)
    const preloadedElements = VIDEO_SOURCES.map(src => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const handleReady = () => {
        if (!mounted) return;
        completedVideos++;
        // Scale video progress from 20% to 95%
        const videoRatio = completedVideos / totalVideos;
        targetProgressRef.current = Math.max(targetProgressRef.current, Math.round(20 + videoRatio * 75));
      };

      video.addEventListener("loadedmetadata", handleReady, { once: true });
      video.addEventListener("loadeddata", handleReady, { once: true });
      video.addEventListener("canplay", handleReady, { once: true });
      video.addEventListener("error", handleReady, { once: true }); // Fallback on network error
      video.src = src;
      video.load();

      return { video, handleReady };
    });

    // Smooth progress interpolation timer
    const interval = setInterval(() => {
      if (!mounted) return;

      // Gradually push target forward if still waiting
      targetProgressRef.current = Math.min(100, targetProgressRef.current + 1.5);

      if (progressRef.current < targetProgressRef.current) {
        progressRef.current = Math.min(100, progressRef.current + 2);
        setProgress(Math.round(progressRef.current));
      }

      // When fully loaded
      if (progressRef.current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (mounted) {
            setIsExiting(true);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 600);
          }
        }, 250);
      }
    }, 30);

    // Hard safety timeout: never block longer than 4.5s regardless of network
    const timeout = setTimeout(() => {
      targetProgressRef.current = 100;
    }, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
      preloadedElements.forEach(({ video, handleReady }) => {
        video.removeEventListener("loadedmetadata", handleReady);
        video.removeEventListener("loadeddata", handleReady);
        video.removeEventListener("canplay", handleReady);
        video.removeEventListener("error", handleReady);
        video.src = "";
      });
    };
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #051a24 0%, #020a0f 70%, #010609 100%)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.02)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "auto",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ease",
      }}
    >
      {/* Background Cyberpunk Grid Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(95,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(95,240,255,0.03) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }}
      />

      {/* Center Content: Logo, Project Name, Loading Bar, Initializing Text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src="/favicon.png"
          alt="AMINA"
          style={{
            width: 72,
            height: 72,
            marginBottom: 20,
            filter: "drop-shadow(0 0 18px rgba(95,240,255,0.8))",
            animation: "pulseLogo 2s ease-in-out infinite alternate",
          }}
        />

        {/* Project Name */}
        <div
          style={{
            color: "#e4fcff",
            fontFamily: '"Titillium Web", sans-serif',
            fontSize: "clamp(22px, 3.5vw, 28px)",
            fontWeight: 300,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 32,
            textShadow: "0 0 20px rgba(95,240,255,0.5)",
          }}
        >
          AMINA-LUNAR
        </div>

        {/* Loading Bar */}
        <div
          style={{
            width: 240,
            height: 4,
            background: "rgba(161,236,251,0.14)",
            border: "1px solid rgba(161,236,251,0.3)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            marginBottom: 14,
            boxShadow: "0 0 12px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #5ff0ff, #b5ff74)",
              boxShadow: "0 0 10px #5ff0ff, 0 0 20px rgba(95,240,255,0.4)",
              transition: "width 0.08s ease-out",
            }}
          />
        </div>

        {/* Small Initializing Text Below */}
        <div
          style={{
            color: "rgba(161,236,251,0.55)",
            fontFamily: '"Source Code Pro", monospace',
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          INITIALIZING... {progress}%
        </div>
      </div>

      <style>{`
        @keyframes pulseLogo {
          0% {
            transform: scale(0.97);
            filter: drop-shadow(0 0 12px rgba(95,240,255,0.6));
          }
          100% {
            transform: scale(1.03);
            filter: drop-shadow(0 0 22px rgba(95,240,255,0.95));
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
