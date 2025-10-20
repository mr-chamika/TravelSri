package com.example.student.services;

import com.google.api.gax.core.NoCredentialsProvider;
import com.google.api.gax.rpc.FixedHeaderProvider;
import com.google.cloud.speech.v1.*;
import com.google.cloud.texttospeech.v1.*;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class GoogleApiService {

    @Value("${google.cloud.api-key}")
    private String apiKey;

    /**
     * Transcribes audio data into text using Google Cloud Speech-to-Text.
     *
     * @param audioData  The raw bytes of the audio file.
     * @param sourceLang The ISO code of the source language (e.g., "en", "es").
     * @return The transcribed text.
     * @throws IOException
     */
    public String speechToText(byte[] audioData, String sourceLang) throws IOException {
        SpeechSettings speechSettings = SpeechSettings.newBuilder()
                .setCredentialsProvider(NoCredentialsProvider.create())
                .setHeaderProvider(FixedHeaderProvider.create(Map.of("x-goog-api-key", apiKey)))
                .build();

        try (SpeechClient speechClient = SpeechClient.create(speechSettings)) {
            ByteString audioBytes = ByteString.copyFrom(audioData);

            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.WEBM_OPUS)
                    .setSampleRateHertz(48000)
                    .setLanguageCode(sourceLang)  // ✅ now comes from parameter
                    .build();

            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            RecognizeResponse response = speechClient.recognize(config, audio);
            List<SpeechRecognitionResult> results = response.getResultsList();

            if (results.isEmpty()) return "";
            return results.get(0).getAlternatives(0).getTranscript();
        }
    }

    /**
     * Translates text into the specified target language using Google Cloud Translation API.
     *
     * @param text       The text to translate.
     * @param targetLang The ISO 639-1 code for the target language (e.g., "es", "fr").
     * @return Translated text.
     */
    public String translateText(String text, String targetLang) {
        Translate translate = TranslateOptions.newBuilder().setApiKey(apiKey).build().getService();

        Translation translation = translate.translate(
                text,
                Translate.TranslateOption.targetLanguage(targetLang)
        );

        return translation.getTranslatedText();
    }

    /**
     * Synthesizes text into speech using Google Cloud Text-to-Speech API.
     *
     * @param text The text to synthesize.
     * @param languageCode The language code for TTS (e.g., "en-US").
     * @return MP3 audio bytes.
     * @throws IOException
     */
    public byte[] textToSpeech(String text, String languageCode) throws IOException {
        TextToSpeechSettings settings = TextToSpeechSettings.newBuilder()
                .setCredentialsProvider(NoCredentialsProvider.create())
                .setHeaderProvider(FixedHeaderProvider.create(Map.of("x-goog-api-key", apiKey)))
                .build();

        try (TextToSpeechClient client = TextToSpeechClient.create(settings)) {
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();

            VoiceSelectionParams.Builder voiceBuilder = VoiceSelectionParams.newBuilder()
                    .setSsmlGender(SsmlVoiceGender.NEUTRAL);

            // Sinhala fallback to English voice
            if (languageCode.equals("si")) {
                voiceBuilder.setLanguageCode("en-US")
                        .setName("en-US-Standard-B"); // fallback
            } else {
                voiceBuilder.setLanguageCode(languageCode);
            }

            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();

            SynthesizeSpeechResponse response = client.synthesizeSpeech(input, voiceBuilder.build(), audioConfig);
            return response.getAudioContent().toByteArray();
        }
    }


}
