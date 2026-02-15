'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const glitchChars = ['4', '0', '1', '?', '#', '@', '*']
    const interval = setInterval(() => {
      setGlitchText(prev => {
        const chars = prev.split('')
        const randomIndex = Math.floor(Math.random() * chars.length)
        chars[randomIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        return chars.join('')
      })
      setTimeout(() => setGlitchText('404'), 100)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden relative">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Animated Binary Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-cyan-500/10 font-mono text-6xl animate-pulse">
          01101110
        </div>
        <div className="absolute top-1/3 right-1/4 text-purple-500/10 font-mono text-4xl animate-pulse" style={{ animationDelay: '1s' }}>
          11110000
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-blue-500/10 font-mono text-5xl animate-pulse" style={{ animationDelay: '2s' }}>
          10101010
        </div>
      </div>

      <div className="text-center relative z-10">
        <div className="mb-12">
          {/* Glitching 404 */}
          <h1 className="text-9xl md:text-[12rem] font-black mb-4 relative">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent blur-xl opacity-50">
              {glitchText}
            </span>
            <span className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {glitchText}
            </span>
          </h1>

          {/* Binary subtitle */}
          <div className="font-mono text-cyan-400 text-sm mb-6 opacity-70">
            01000101 01110010 01110010 01101111 01110010
          </div>

          {/* Error message */}
          <div className="mt-8 space-y-3">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-xl font-bold text-red-400">Page Not Found</p>
            </div>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              This bit pattern doesn't exist in our matrix.
            </p>
          </div>
        </div>

        {/* Pixel art decoration */}
        <div className="flex justify-center gap-2 mb-12">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-cyan-500/30 border border-cyan-500/50"
              style={{
                animation: `pulse ${1 + i * 0.1}s infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Back to home button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-mono">Return Home</span>
        </Link>

        {/* Tech details */}
        <div className="mt-12 text-gray-600 font-mono text-xs">
          <p>Error Code: 0x194 • Missing Data Block</p>
        </div>
      </div>
    </main>
  )
}
