import { useState } from 'react'
import { speakMessage, startListening } from '../../../voice/voice.js'

function VoiceAssistant() {
  const [language, setLanguage] = useState('bengali')
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Ready')

  const messages = {
    bengali: 'স্বাগতম। এটি Health Guardian-এর ডেমো ভয়েস অ্যাসিস্ট্যান্ট।',
    hindi: 'स्वागत है। यह Health Guardian का डेमो वॉइस असिस्टेंट है।',
    english: 'Welcome. This is the Health Guardian demo voice assistant.'
  }

  const listen = () => {
    setStatus('Listening...')
    try {
      startListening(language, (result) => {
        setTranscript(result)
        setStatus('Speech received')
      })
    } catch {
      setStatus('Voice recognition is not available.')
    }
  }

  const speak = () => {
    speakMessage(messages[language], language)
    setStatus('Speaking demo message')
  }

  return (
    <section className="voice" id="voice">
      <h2>🎙️ Voice Assistant</h2>
      <p>Demo voice assistant. Do not share private medical information.</p>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="bengali">বাংলা</option>
        <option value="hindi">हिन्दी</option>
        <option value="english">English</option>
      </select>
      <div>
        <button onClick={listen}>🎤 Start Listening</button>
        <button onClick={speak}>🔊 Speak Demo Message</button>
      </div>
      <p>Status: {status}</p>
      <p>Recognized text: {transcript || 'Nothing received yet'}</p>
    </section>
  )
}

export default VoiceAssistant
