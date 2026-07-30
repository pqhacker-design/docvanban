import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  barCount = 32,
  height = 40,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const gap = 2;
      const effectiveWidth = barWidth - gap;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic wave formula combining sine waves and noise
          const val = Math.sin(phase + i * 0.2) * 0.5 + Math.cos(phase * 1.5 + i * 0.1) * 0.3 + 0.5;
          barHeight = Math.max(6, val * (canvas.height - 4));
        } else {
          barHeight = 4 + (Math.sin(i * 0.3) + 1) * 3;
        }

        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;

        // Teal gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, isPlaying ? '#0d9488' : '#64748b'); // teal-600 vs slate-500
        gradient.addColorStop(1, isPlaying ? '#14b8a6' : '#94a3b8'); // teal-500 vs slate-400

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, effectiveWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={height}
      className={`w-full max-w-[280px] h-[${height}px] ${className}`}
    />
  );
};
