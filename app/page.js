'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [binaryRain, setBinaryRain] = useState([])
  const [uploadText, setUploadText] = useState('Upload Image')
  const [extractText, setExtractText] = useState('Extract Message')
  const [dots, setDots] = useState('')
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)

  useEffect(() => {
    const columns = Math.floor(window.innerWidth / 20)
    const initialRain = Array.from({ length: columns }, (_, i) => ({
      id: i,
      x: i * 20,
      y: Math.random() * -500,
      speed: Math.random() * 2 + 1,
      bits: Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0')
    }))
    setBinaryRain(initialRain)

    const interval = setInterval(() => {
      setBinaryRain(prev => prev.map(drop => ({
        ...drop,
        y: drop.y > window.innerHeight ? -100 : drop.y + drop.speed,
        bits: drop.y % 100 === 0 
          ? Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0')
          : drop.bits
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (preview) {
      // Typing effect: "Upload Image" -> "Uploaded Image"
      const targetText = 'Uploaded Image'
      let currentIndex = 'Upload'.length
      setUploadText('Upload')
      
      let typingInterval
      // Wait for resize animation to complete (500ms)
      const startDelay = setTimeout(() => {
        typingInterval = setInterval(() => {
          if (currentIndex <= targetText.length) {
            setUploadText(targetText.substring(0, currentIndex))
            currentIndex++
          } else {
            clearInterval(typingInterval)
          }
        }, 150)
      }, 500)
      
      return () => {
        clearTimeout(startDelay)
        if (typingInterval) clearInterval(typingInterval)
      }
    } else {
      setUploadText('Upload Image')
    }
  }, [preview])

  useEffect(() => {
    if (loading) {
      // Typing effect: "Extract Message" -> "Extracting Message"
      const targetText = 'Extracting Message'
      let currentIndex = 'Extract'.length
      let typingInterval
      
      const startDelay = setTimeout(() => {
        typingInterval = setInterval(() => {
          if (currentIndex <= targetText.length) {
            setExtractText(targetText.substring(0, currentIndex))
            currentIndex++
          } else {
            clearInterval(typingInterval)
          }
        }, 100)
      }, 200)

      // Animate dots
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 500)

      return () => {
        clearTimeout(startDelay)
        if (typingInterval) clearInterval(typingInterval)
        clearInterval(dotsInterval)
      }
    } else if (result) {
      // Typing effect: "Extracting Message" -> "Extracted Message"
      setDots('')
      const targetText = 'Extracted Message'
      let currentIndex = 'Extract'.length
      let typingInterval
      
      const startDelay = setTimeout(() => {
        typingInterval = setInterval(() => {
          if (currentIndex <= targetText.length) {
            setExtractText(targetText.substring(0, currentIndex))
            currentIndex++
          } else {
            clearInterval(typingInterval)
          }
        }, 100)
      }, 200)

      return () => {
        clearTimeout(startDelay)
        if (typingInterval) clearInterval(typingInterval)
      }
    } else {
      setExtractText('Extract Message')
      setDots('')
    }
  }, [loading, result])

  useEffect(() => {
    if (result && result.content) {
      // Typing effect for the extracted message
      let currentIndex = 0
      setDisplayedMessage('')
      setIsTyping(true)
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= result.content.length) {
          setDisplayedMessage(result.content.substring(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 100) // 100ms per character to match header typing speed

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedMessage('')
      setIsTyping(false)
    }
  }, [result])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        // Auto-submit after image loads
        handleSubmitWithFile(selectedFile)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmitWithFile = async (fileToSubmit) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', fileToSubmit)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://secret-extractor-backend.onrender.com'
      const response = await fetch(`${apiUrl}/getMessage`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image')
      }

      if (data.message) {
        setResult({ 
          success: true,
          content: data.message
        })
      } else {
        setResult({ 
          success: true,
          content: null
        })
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setFileInputKey(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative pb-24">
      {/* Binary Rain Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        {binaryRain.map(drop => (
          <div
            key={drop.id}
            className="absolute font-mono text-green-400 text-xs"
            style={{ 
              left: `${drop.x}px`, 
              top: `${drop.y}px`,
              textShadow: '0 0 5px #4ade80'
            }}
          >
            {drop.bits.map((bit, i) => (
              <div key={i} className="leading-tight">{bit}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Pixel Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center transition-all duration-500 ${preview ? 'mb-6' : 'mb-8'}`}>
            <div className="mb-3 mt-2">
              <div className={`inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-full transition-all duration-500 ${preview ? 'mb-4' : 'mb-4'}`}>
                <span className="font-mono text-cyan-400 text-sm">⬡ Steganographic Data Embedding and Extraction</span>
              </div>
              <h1 className={`font-black relative transition-all duration-500 ${preview ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl mb-4'}`}>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Hidden in Plain Sight
                </span>
              </h1>
              <p className={`text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-500 ${preview ? 'text-base' : 'text-xl'}`}>
                Extract <span className="text-cyan-400 font-bold">secret</span> messages encoded in images.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-500">
            {/* Upload Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-2 h-2 rounded-full animate-pulse ${preview ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h2 className="text-xl font-bold text-gray-200">{uploadText}</h2>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className={`border-2 border-dashed rounded-xl transition-all duration-300 relative group ${preview ? 'border-cyan-500 p-0' : 'border-gray-700 hover:border-cyan-500 p-8 min-h-[288px] flex items-center justify-center'}`}>
                  <label htmlFor="file-upload" className="cursor-pointer block w-full">
                    <div className="text-center">
                      {preview ? (
                        <div className="relative w-full h-72 animate-fadeIn">
                          <img 
                            key={preview}
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <span className="text-cyan-400 text-sm font-mono">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-fadeIn">
                          <div className="mb-4">
                            <div className="mx-auto w-24 h-24 mb-4 relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center w-full h-full">
                                <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl text-gray-400">
                            <span className="font-semibold text-cyan-400 hover:text-cyan-300">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </div>
                          <p className="text-lg text-gray-500 mt-3 font-mono">
                            PNG, JPG, JPEG • Max 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      key={fileInputKey}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-cyan-400 font-mono text-sm">Extracting bits...</span>
                  </div>
                )}

                {(file || result) && !loading && (
                  <div className="flex justify-center gap-4">
                    <label htmlFor="upload-new-file" className="cursor-pointer">
                      <div className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50">
                        Upload New
                      </div>
                    </label>
                    <input
                      key={fileInputKey}
                      id="upload-new-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-8 py-3 border-2 border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-2 h-2 rounded-full animate-pulse ${!preview ? 'bg-red-500' : loading ? 'bg-yellow-500' : result ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h2 className="text-xl font-bold text-gray-200">{extractText}{loading && dots}</h2>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="bg-gradient-to-br from-red-900/40 to-red-900/20 border-l-4 border-red-500 backdrop-blur-xl p-6 rounded-xl animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-300 font-medium font-mono text-sm">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <>
                  <div className="border-2 border-dashed border-cyan-500 rounded-xl px-8 py-6 h-72 overflow-auto transition-all duration-300 animate-fadeIn">
                    {result.content ? (
                      <div className="w-full">
                        <p className="text-gray-100 text-xl font-mono break-words leading-relaxed text-left">
                          {displayedMessage}{isTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <p className="text-2xl font-mono">Message could not be found</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {result.content && (
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(result.content)}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
                      >
                        Copy Message
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ text: result.content })
                          }
                        }}
                        className="px-8 py-3 border-2 border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200"
                      >
                        Share
                      </button>
                    </div>
                  )}
                </>
              )}

              {!error && !result && (
                <div className="flex items-center justify-center h-full min-h-[288px] bg-gradient-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-700 animate-fadeIn">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                      <svg className="relative w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-mono font-bold">Awaiting extraction</p>
                    <p className="text-lg text-gray-600 mt-3">Your decoded message will appear here</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 py-4 border-t border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-mono mb-2">
              © {new Date().getFullYear()} Arpan Mandal. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Anonymous</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </main>
  )
}
