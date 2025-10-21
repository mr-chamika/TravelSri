import React, { useState, useRef } from 'react';

// --- IMPORTANT ---
// Replace with the local IP address of the machine running your Spring Boot server.
// On Mac/Linux, find it with `ifconfig` or `ip addr`. On Windows, use `ipconfig`.
// Do NOT use 'localhost' or '127.0.0.1' as your computer won't be able to reach it from a browser.
const BACKEND_URL = 'http://192.168.1.150:8080';

// --- SVG Icons ---
const MicIcon = ({ isListening = false }: { isListening?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${
      isListening
        ? 'text-red-500 animate-pulse'
        : 'text-gray-500 group-hover:text-gray-700'
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 4a1 1 0 10-2 0v1a1 1 0 102 0V8z"
      clipRule="evenodd"
    />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
  </svg>
);

const ArrowSwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  </svg>
);

const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500 group-hover:text-gray-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.5 10a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

// --- Language Data ---
const LANGS = ['English', 'Tamil', 'Hindi', 'Russian', 'Japanese', 'Sinhala'];
const LANGUAGE_CODES: { [key: string]: string } = {
  English: 'en', Tamil: 'ta', Hindi: 'hi', Russian: 'ru', Japanese: 'ja', Sinhala: 'si',
};

// --- Reusable Components ---
interface TextBoxProps {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isEditable?: boolean;
  placeholder?: string;
  bgColor?: string;
  type: 'source' | 'target';
  onIconClick: () => void;
  isListening?: boolean;
}

function TextBox({ value, onChange, isEditable = true, placeholder, bgColor = 'bg-white', type, onIconClick, isListening = false,}: TextBoxProps) {
  return (
    <div
      className={`relative w-full h-full border-2 border-gray-200 flex flex-col justify-between rounded-xl shadow-sm ${bgColor} transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
    >
      <textarea
        readOnly={!isEditable || isListening}
        value={value}
        onChange={onChange}
        className={`w-full h-full p-4 resize-none bg-transparent ${
          isEditable ? 'text-gray-800' : 'text-gray-600'
        } flex-1 focus:outline-none placeholder-gray-400`}
        placeholder={placeholder}
      />
      <button
        onClick={onIconClick}
        disabled={type === 'target' && !value}
        className="absolute bottom-2 right-2 p-2 rounded-full group hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {type === 'source' ? (<MicIcon isListening={isListening} />) : (<SpeakerIcon />)}
      </button>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Sinhala');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [translatedAudio, setTranslatedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
    setTranslatedAudio(null);
  };
  
  const handleBackendRequest = async (url: string, body: FormData) => {
    setIsLoading(true);
    setError('');
    setTargetText('');
    setTranslatedAudio(null);

    try {
        const res = await fetch(url, { method: 'POST', body });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server error: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        if(data.originalText) setSourceText(data.originalText);
        setTargetText(data.translatedText);
        setTranslatedAudio(data.translatedAudio);

    } catch (err) {
        console.error('API request error', err);
        setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
        setIsLoading(false);
    }
  }

  const handleTranslateText = () => {
  if (!sourceText.trim()) return;

  const formData = new FormData();
  formData.append('text', sourceText);
  formData.append('targetLang', LANGUAGE_CODES[targetLang]);
  formData.append('sourceLang', LANGUAGE_CODES[sourceLang]); // ✅ Add this line

  handleBackendRequest(`${BACKEND_URL}/api/translate/text`, formData);
  };

  
  const handleTranslateSpeech = (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm'); 
  formData.append('targetLang', LANGUAGE_CODES[targetLang]);
  formData.append('sourceLang', LANGUAGE_CODES[sourceLang]); // <-- add this line
  handleBackendRequest(`${BACKEND_URL}/api/translate/speech`, formData);
  }


  const handleMicClick = async () => {
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support audio recording.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = newMediaRecorder;

        const audioChunks: Blob[] = [];
        newMediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        newMediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          setIsListening(false);
          if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            handleTranslateSpeech(audioBlob);
          }
        };
        
        newMediaRecorder.start();
        setIsListening(true);
        setError('');
        setSourceText('');
      } catch (err) {
        setError('Microphone access was denied. Please allow microphone permissions.');
        setIsListening(false);
      }
    }
  };

  const handleSpeakerClick = () => {
    if (!translatedAudio) return;
    try {
        const audioSrc = `data:audio/mp3;base64,${translatedAudio}`;
        const audio = new Audio(audioSrc);
        audio.play();
        audio.onerror = () => setError('Could not play the generated audio.');
    } catch(err) {
        setError('Error playing speech.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-2">
        <h1 className="font-bold text-3xl text-center text-gray-800">
          Translator
        </h1>

        <div className="space-y-2">
          <div className="relative">
            <button
              onClick={() => {
                setShowSourceDropdown(!showSourceDropdown);
                setShowTargetDropdown(false);
              }}
              className="w-full text-left border border-gray-300 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sourceLang}
            </button>
            {showSourceDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {LANGS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSourceLang(loc);
                      setShowSourceDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sourceLang === loc ? 'font-semibold text-blue-600' : ''
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-full h-52">
            <TextBox
              type="source"
              value={isListening ? 'Listening... Click mic to stop' : sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              isEditable={true}
              placeholder="Enter text or click mic to speak..."
              onIconClick={handleMicClick}
              isListening={isListening}
            />
          </div>
        </div>

        <div className="flex justify-center items-center py-1 my-1">
          <button
            onClick={swapLanguages}
            className="p-2 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-300 hover:rotate-180"
          >
            <ArrowSwapIcon />
          </button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <button
              onClick={() => {
                setShowTargetDropdown(!showTargetDropdown);
                setShowSourceDropdown(false);
              }}
              className="w-full text-left border border-gray-300 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {targetLang}
            </button>
            {showTargetDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {LANGS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setTargetLang(loc);
                      setShowTargetDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      targetLang === loc ? 'font-semibold text-blue-600' : ''
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-full h-52">
            <TextBox
              type="target"
              value={isLoading ? 'Translating...' : targetText}
              isEditable={false}
              placeholder="Translation..."
              bgColor="bg-gray-100"
              onIconClick={handleSpeakerClick}
            />
          </div>
        </div>

        <div className="pt-1 flex flex-col items-center">
          <button
            onClick={handleTranslateText}
            disabled={isLoading || !sourceText || isListening}
            className="w-full max-w-xs rounded-full justify-center bg-[#fef08a] text-gray-900 font-extrabold h-12 flex items-center transition-opacity hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div> : 'Translate'}
          </button>
          {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

