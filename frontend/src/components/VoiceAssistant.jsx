
import { useState } from 'react'
import {
  speakMessage,
  startListening
} from '../voice/voice'

function VoiceAssistant() {
  const [language, setLanguage] = useState('bengali')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [listening, setListening] = useState(false)

  const handleListen = () => {
    setTranscript('')
    setResponse('')
    setListening(true)

    const recognition = startListening(language, (text) => {
      setTranscript(text)
      setListening(false)

      const reply = `আপনি বলেছেন: ${text}। আরও স্বাস্থ্য সংক্রান্ত তথ্যের জন্য চিকিৎসকের পরামর্শ নিন।`

      setResponse(reply)
      speakMessage(reply, language)
    })

    if (!recognition) {
      setListening(false)
      setResponse('Your browser does not support voice recognition.')
    } else {
      recognition.onend = () => setListening(false)
    }
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
  }

  return (
    <section id="voice" className="voice-section">
      <h2>🎤 Voice Assistant</h2>
      <p>Talk to your Health Guardian in your preferred language.</p>

      <label>Select Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="bengali">বাংলা</option>
        <option value="hindi">हिन्दी</option>
        <option value="english">English</option>
      </select>

      <div className="voice-box">
        <div className="mic-icon">
          🎙️
        </div>

        <h3>{listening ? 'Listening...' : 'Ready to Listen'}</h3>

        <button onClick={handleListen} disabled={listening}>
          {listening ? 'Listening...' : '🎤 Start Listening'}
        </button>

        <button onClick={stopSpeaking}>
          Stop Speaking
        </button>
      </div>

      <div className="voice-output">
        <h3>📝 Your Voice Input</h3>
        <p>{transcript || 'Your spoken words will appear here.'}</p>
      </div>

      <div className="voice-output">
        <h3>🔊 Assistant Response</h3>
        <p>{response || 'Assistant response will appear here.'}</p>
      </div>
    </section>
  )
}

export default VoiceAssistant
