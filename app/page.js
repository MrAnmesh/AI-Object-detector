
"use client";
import ObjectDetection from "@/components/object-detection";
import React, { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((d) => !d);
  return (
    <main
      className={
        (darkMode
          ? "bg-gradient-to-br from-[#232526] via-[#1a1a2e] to-[#0f2027]"
          : "bg-gradient-to-br from-[#e0e7ff] via-[#f0f4ff] to-[#c7d2fe]") +
        " min-h-screen flex flex-col items-center justify-start p-0 relative overflow-x-hidden transition-colors duration-700 font-sans"
      }
    >
      {/* Animated floating accent shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/30 to-purple-500/10 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-pink-400/20 to-purple-500/10 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-sky-400/20 to-indigo-400/10 rounded-full blur-2xl z-0 animate-pulse" />

      {/* Header */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full mb-10 mt-16">
        <div className="flex flex-row items-center gap-4">
          <h1
            className={
              (darkMode ? "text-indigo-300" : "text-indigo-700") +
              " text-6xl md:text-7xl lg:text-8xl font-extrabold text-center drop-shadow-[0_6px_48px_rgba(0,0,0,0.7)] tracking-tight shadow-2xl px-4 transition-colors duration-700"
            }
            style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
          >
            <span className="inline-block transform -rotate-2">AI</span>{" "}
            <span className="inline-block transform rotate-1">Object</span>{" "}
            <span className="inline-block transform -rotate-1">Detector</span>
          </h1>
          <button
            className="ml-2 px-3 py-2 rounded-full bg-indigo-700 hover:bg-indigo-600 text-white text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            title="Project Info"
            onClick={() => setShowModal(true)}
          >
            ℹ️
          </button>
          <button
            className={
              (darkMode
                ? "bg-gray-900 hover:bg-gray-800 text-indigo-200"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700") +
              " ml-2 px-3 py-2 rounded-full text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            }
            title="Toggle Dark/Light Mode"
            onClick={toggleTheme}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* Main Card with glassmorphism */}
      <div className="relative w-full max-w-3xl flex flex-col items-center z-10">
        <div
          className={
            (darkMode
              ? "bg-white/10 border border-indigo-400/30"
              : "bg-white/70 border border-indigo-200/60") +
            " shadow-2xl rounded-3xl p-8 backdrop-blur-xl transition-colors duration-700 w-full"
          }
          style={{ boxShadow: '0 8px 40px 0 rgba(80,80,180,0.18)' }}
        >
          <ObjectDetection darkMode={darkMode} />
        </div>
      </div>

      {/* Footer */}
      <footer
        className={
          (darkMode ? "text-indigo-200" : "text-indigo-700") +
          " w-full text-center py-6 text-base mt-10 z-20 transition-colors duration-700 font-medium"
        }
      >
        <span>
          Made with <span className={darkMode ? "text-pink-400" : "text-pink-600"}>Next.js</span>,{' '}
          <span className={darkMode ? "text-yellow-300" : "text-yellow-600"}>TensorFlow</span>, and{' '}
          <span className={darkMode ? "text-red-400" : "text-red-600"}>❤️</span>
        </span>
        <span className="mt-1 block">© {new Date().getFullYear()} Anmesh Mishra</span>
      </footer>

      {/* Project Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#23263a] border border-indigo-400 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-200 text-2xl font-bold focus:outline-none"
              onClick={() => setShowModal(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold text-indigo-300 mb-2">About This Project</h2>
            <p className="text-indigo-100 mb-4">AI Object Detector is a real-time web app that uses your webcam and TensorFlow.js to detect objects live in your environment. Built with Next.js 14, React, and Tailwind CSS.</p>
            <ul className="list-disc list-inside text-indigo-200 mb-4">
              <li>Detects 80+ common objects using the COCO-SSD model</li>
              <li>Displays live object count, types, and detection confidence</li>
              <li>Modern, responsive, and animated UI</li>
              <li>Snapshot, history, and more features possible</li>
            </ul>
            <div className="mb-2">
              <span className="font-semibold text-indigo-300">Tech Stack:</span>
              <span className="ml-2 text-indigo-100">Next.js, React, TensorFlow.js, Tailwind CSS</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-indigo-300">Author:</span>
              <span className="ml-2 text-indigo-100">Anmesh Mishra</span>
            </div>
            <div>
              <span className="font-semibold text-indigo-300">Contact:</span>
              <span className="ml-2 text-indigo-100">anmeshmishra17@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
