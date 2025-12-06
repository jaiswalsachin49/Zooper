import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

/**
 * Custom Video.js Player Component
 * Provides a fully customizable video player with Zooper branding
 */
const VideoPlayer = ({ 
  src, 
  poster, 
  onTimeUpdate, 
  onEnded, 
  onReady,
  startTime = 0,
  autoplay = false 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: autoplay,
        preload: 'auto',
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        controlBar: {
          volumePanel: {
            inline: false
          }
        },
        userActions: {
          hotkeys: function(event) {
            // Space bar = play/pause
            if (event.which === 32) {
              event.preventDefault();
              if (this.paused()) {
                this.play();
              } else {
                this.pause();
              }
            }
            // Arrow left = rewind 10s
            if (event.which === 37) {
              event.preventDefault();
              this.currentTime(Math.max(0, this.currentTime() - 10));
            }
            // Arrow right = forward 10s
            if (event.which === 39) {
              event.preventDefault();
              this.currentTime(Math.min(this.duration(), this.currentTime() + 10));
            }
            // Arrow up = volume up
            if (event.which === 38) {
              event.preventDefault();
              this.volume(Math.min(1, this.volume() + 0.1));
            }
            // Arrow down = volume down
            if (event.which === 40) {
              event.preventDefault();
              this.volume(Math.max(0, this.volume() - 0.1));
            }
            // F = fullscreen
            if (event.which === 70) {
              event.preventDefault();
              if (this.isFullscreen()) {
                this.exitFullscreen();
              } else {
                this.requestFullscreen();
              }
            }
            // M = mute/unmute
            if (event.which === 77) {
              event.preventDefault();
              this.muted(!this.muted());
            }
          }
        }
      }, () => {
        console.log('Player is ready');
        if (onReady) {
          onReady(player);
        }
      });

      // Set up event listeners
      player.on('timeupdate', () => {
        if (onTimeUpdate) {
          onTimeUpdate(player.currentTime(), player.duration());
        }
      });

      player.on('ended', () => {
        if (onEnded) {
          onEnded();
        }
      });

      // Start from specific time if provided
      if (startTime > 0) {
        player.ready(() => {
          player.currentTime(startTime);
        });
      }

    } else {
      const player = playerRef.current;
      
      // Update source if it changes
      player.src({ src, type: 'video/mp4' });
      if (poster) {
        player.poster(poster);
      }
    }
  }, [src, poster, onTimeUpdate, onEnded, onReady, startTime, autoplay]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-zooper"
        playsInline
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that supports HTML5 video
        </p>
      </video>
    </div>
  );
};

export default VideoPlayer;
