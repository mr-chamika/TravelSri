import React, { useState } from 'react';

// --- SVG Icons ---
// Replaced local image files with inline SVGs to work in a web environment.
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-gray-700" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 4a1 1 0 10-2 0v1a1 1 0 102 0V8z" clipRule="evenodd" />
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
    </svg>
);

const ArrowSwapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

// --- Language Data ---
const LANGS = ['English', 'Tamil', 'Hindi', 'Russian', 'Japanese', 'Sinhala'];
const LANGUAGE_CODES = {
  English: 'en',
  Tamil: 'ta',
  Hindi: 'hi',
  Russian: 'ru',
  Japanese: 'ja',
  Sinhala: 'si',
};

// --- Reusable Components ---
// Replaced React Native's TextInput and View with textarea and div for web compatibility.
function TextBox({
  value,
  onChange,
  isEditable = true,
  placeholder,
  bgColor = 'bg-white',
}) {
  return (
    <div className={`relative w-full h-full border-2 border-gray-200 flex flex-col justify-between rounded-xl shadow-sm ${bgColor} transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
      <textarea
        readOnly={!isEditable}
        value={value}
        onChange={onChange}
        className={`w-full h-full p-4 resize-none bg-transparent ${isEditable ? 'text-gray-800' : 'text-gray-600'} flex-1 focus:outline-none placeholder-gray-400`}
        placeholder={placeholder}
      />
      <button className="absolute bottom-2 right-2 p-2 rounded-full group hover:bg-gray-200 transition-colors">
        <MicIcon />
      </button>
    </div>
  );
}

export default function App() {
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Sinhala');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const translateText = async () => {
    const q = sourceText?.trim();
    if (!q) {
      setError('Please enter text to translate.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTargetText('');

    const sourceCode = LANGUAGE_CODES[sourceLang] || 'auto';
    const targetCode = LANGUAGE_CODES[targetLang] || 'en';

    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, source: sourceCode, target: targetCode, format: 'text' }),
      });

      if (!res.ok) {
        throw new Error('Translation API failed. Please try again later.');
      }

      const data = await res.json();
      setTargetText(data.translatedText ?? '');
    } catch (err) {
      console.error('Translation error', err);
      setError(err.message || 'Unable to translate. Check your connection and try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="font-bold text-3xl text-center text-gray-800">Translator</h1>
        
        {/* Source Language Area */}
        <div className="space-y-2">
            <div className="relative">
                <button onClick={() => { setShowSourceDropdown(!showSourceDropdown); setShowTargetDropdown(false); }} className="w-full text-left border border-gray-300 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {sourceLang}
                </button>
                {showSourceDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {LANGS.map((loc) => (
                        <button key={loc} onClick={() => { setSourceLang(loc); setShowSourceDropdown(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sourceLang === loc ? 'font-semibold text-blue-600' : ''}`}>
                            {loc}
                        </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full h-48">
                <TextBox value={sourceText} onChange={(e) => setSourceText(e.target.value)} isEditable={true} placeholder="Enter text..."/>
            </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center items-center py-2 my-3">
             <button onClick={swapLanguages} className="p-2 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-300 hover:rotate-180">
                <ArrowSwapIcon />
            </button>
        </div>

        {/* Target Language Area */}
        <div className="space-y-2">
            <div className="relative">
                <button onClick={() => { setShowTargetDropdown(!showTargetDropdown); setShowSourceDropdown(false); }} className="w-full text-left border border-gray-300 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {targetLang}
                </button>
                {showTargetDropdown && (
                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {LANGS.map((loc) => (
                        <button key={loc} onClick={() => { setTargetLang(loc); setShowTargetDropdown(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${targetLang === loc ? 'font-semibold text-blue-600' : ''}`}>
                            {loc}
                        </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full h-48">
                <TextBox value={isLoading ? 'Translating...' : targetText} isEditable={false} placeholder="Translation..." bgColor="bg-gray-100"/>
            </div>
        </div>

        {/* Translate Button and Error Message */}
        <div className="pt-2 flex flex-col items-center">
            <button onClick={translateText} disabled={isLoading || !sourceText} className="w-full max-w-xs rounded-full justify-center bg-[#FEFA17] text-gray-900 font-extrabold h-12 items-center transition-opacity hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Translate
            </button>
            {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

