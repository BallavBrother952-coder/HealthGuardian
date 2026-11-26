
import { useState } from 'react'

// Health Response Function
function getHealthResponse(message) {
  const text = message.toLowerCase().trim()

  if (/^(hi|hello|hey)$/.test(text)) {
    return 'Hello! Welcome to Health Guardian. How can I help you today?'
  }

  if (
    text.includes('fever') ||
    text.includes('feaver')
  ) {
    return 'Fever means your body temperature is higher than normal. Drink enough fluids and rest. If your fever is high, persistent, or accompanied by serious symptoms, consult a healthcare professional.'
  }

  if (text.includes('headache')) {
    return 'A headache is pain in your head. It may be related to stress, dehydration, or lack of sleep. Rest and drink water. Seek medical advice if it is severe or unusual.'
  }

  if (text.includes('cough') || text.includes('cold')) {
    return 'Cough and cold can occur due to viral infections or other causes. Rest and drink fluids. Seek medical help if you have breathing difficulty.'
  }

  if (
    text.includes('blood pressure') ||
    text.includes(' bp')
  ) {
    return 'Blood pressure measures the force of blood against artery walls. It is written as two numbers, such as 120/80 mmHg. A healthcare professional can help interpret your reading.'
  }

  if (
    text.includes('heart rate') ||
    text.includes('heartbeat')
  ) {
    return 'Heart rate means the number of times your heart beats per minute. It changes with exercise, stress, age, and health conditions.'
  }

  if (text.includes('oxygen') || text.includes('spo2')) {
    return 'Oxygen saturation (SpO2) estimates how much oxygen your blood carries. If you have difficulty breathing, seek urgent medical help.'
  }

  if (text.includes('medicine') || text.includes('tablet')) {
    return 'Always take medicine according to a qualified healthcare professional’s instructions. Do not change your medicine dose without medical advice.'
  }

  if (text.includes('problem') || text.includes('help')) {
    return 'I am here to help. Could you describe your health problem and the symptoms you are experiencing?'
  }

  return 'I can explain common health topics like fever, headache, cough, blood pressure, heart rate, oxygen levels, and medicines. Could you tell me more about your question?'
}

function AIChatbot() {
  const [message, setMessage] = useState('')

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Health Guardian. How can I help you today?'
    }
  ])

  const sendMessage = (e) => {
    e.preventDefault()

    if (!message.trim()) return

    const userMessage = message.trim()
    const botReply = getHealthResponse(userMessage)

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMessage },
      { sender: 'bot', text: botReply }
    ])

    setMessage('')
  }

  return (
    <section className="chat-section" id="chatbot">
      <h2>🤖 AI Health Assistant</h2>
      <p>Ask questions about general health information.</p>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender}`}
          >
            <strong>
              {msg.sender === 'bot' ? 'Health Assistant' : 'You'}
            </strong>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={sendMessage}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Ask a health question..."
          aria-label="Ask a health question"
        />

        <button type="submit">Send</button>
      </form>

      <small>
        Demo assistant only. Not a substitute for medical advice.
      </small>
    </section>
  )
}

export default AIChatbot
