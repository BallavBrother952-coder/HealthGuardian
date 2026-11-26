const languages = {
    bengali: "bn-IN",
    hindi: "hi-IN",
    english: "en-IN"
};

// Speak a message
export function speakMessage(message, language = "bengali") {
    if (!("speechSynthesis" in window)) {
        console.log("Speech is not supported.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = languages[language] || "en-IN";
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}

// Start voice recognition
export function startListening(language = "bengali", onResult = () => {}) {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.log("Voice recognition is not supported.");
        return null;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = languages[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
    };

    recognition.start();

    return recognition;
}