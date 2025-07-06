"use client";

import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {load as cocoSSDLoad} from "@tensorflow-models/coco-ssd";
// Placeholder for YOLO import (if you add a YOLO model, import it here)
import * as tf from "@tensorflow/tfjs";
import {renderPredictions} from "@/utils/render-predictions";

let detectInterval;


// Speak detected object labels using Web Speech API
function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1.1;
    utter.volume = 1;
    window.speechSynthesis.cancel(); // Stop previous utterances
    window.speechSynthesis.speak(utter);
  }
}

const ObjectDetection = ({ darkMode = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [objectStats, setObjectStats] = useState({ count: 0, types: [], lastDetections: [] });
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const downloadRef = useRef(null);

  async function runCoco() {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  }

  // Track last spoken objects to avoid repeating
  const lastSpokenRef = useRef([]);

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects with higher accuracy threshold and flip horizontal
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.3 // Lowered threshold to detect more objects (may include more false positives)
      );

      // Calculate stats for UI
      const types = [...new Set(detectedObjects.map(obj => obj.class))];

      setObjectStats({
        count: detectedObjects.length,
        types,
        lastDetections: detectedObjects.slice(0, 5).map(obj => ({
          class: obj.class,
          score: obj.score
        }))
      });

      // Voice feedback: announce new objects
      const currentLabels = detectedObjects.map(obj => obj.class);
      const newLabels = currentLabels.filter(label => !lastSpokenRef.current.includes(label));
      if (newLabels.length > 0) {
        speak(newLabels.join(", "));
        lastSpokenRef.current = currentLabels;
      } else if (currentLabels.length === 0 && lastSpokenRef.current.length > 0) {
        // If nothing detected, clear last spoken
        lastSpokenRef.current = [];
      }

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context, darkMode ? 'dark' : 'light');
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showmyVideo();
    return () => {
      if (detectInterval) clearInterval(detectInterval);
    };
  }, []);

  // Snapshot feature
  const handleSnapshot = () => {
    if (!canvasRef.current || !webcamRef.current) return;
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Draw the overlay canvas (bounding boxes, labels)
    ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
    // Download the combined image
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `snapshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8 w-full flex flex-col items-center">

      {/* Object stats bar */}
      <div className="w-full max-w-2xl mb-4 flex flex-col md:flex-row md:items-center md:justify-between bg-sky-950/60 border border-sky-400/30 rounded-lg px-4 py-2 text-sky-200 shadow-lg animate-fade-in">
        <div className="font-semibold">Detected: <span className="text-sky-300">{objectStats.count}</span></div>
        <div className="flex flex-wrap gap-2 mt-1 md:mt-0 text-xs">
          {objectStats.types.map(type => (
            <span key={type} className="bg-sky-400/20 text-sky-100 px-2 py-1 rounded-md border border-sky-400/30 font-mono">{type}</span>
          ))}
        </div>
      </div>
      {/* Detection history & snapshot button */}
      <div className="w-full max-w-2xl mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-sky-300">
        <div className="flex flex-wrap gap-2">
          {objectStats.lastDetections.length > 0 && (
            <>
              <span className="font-semibold">Recent:</span>
              {objectStats.lastDetections.map((d, i) => (
                <span key={i} className="bg-sky-400/10 px-2 py-1 rounded-md border border-sky-400/20 font-mono">
                  {d.class} ({(d.score * 100).toFixed(1)}%)
                </span>
              ))}
            </>
          )}
        </div>
        <button
          onClick={handleSnapshot}
          className="mt-2 md:mt-0 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          📸 Snapshot
        </button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <svg className="animate-spin h-12 w-12 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-lg text-sky-200 font-semibold animate-pulse">Loading AI Model...</span>
        </div>
      ) : (
        <div className="relative flex justify-center items-center bg-black/80 border-4 border-sky-400 shadow-2xl rounded-xl overflow-hidden w-full max-w-2xl aspect-video">
          {/* webcam */}
          <Webcam
            ref={webcamRef}
            className="rounded-xl w-full h-full object-cover opacity-90"
            muted
          />
          {/* canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
