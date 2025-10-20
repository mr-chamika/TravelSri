package com.example.student.controller;
import com.example.student.services.GoogleApiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin // Allow requests from any origin, adjust for production
public class TranslatorController {

    private final GoogleApiService googleApiService;

    @Autowired
    public TranslatorController(GoogleApiService googleApiService) {
        this.googleApiService = googleApiService;
    }

    /**
     * Endpoint to handle speech-to-text, translation, and text-to-speech from an audio file.
     * @param file The audio file to be translated.
     * @param targetLang The target language code (e.g., "es", "fr").
     * @return A JSON object with original text, translated text, and Base64 encoded audio.
     */
    @PostMapping("/speech")
    public ResponseEntity<?> translateSpeech(
            @RequestParam("file") MultipartFile file,
            @RequestParam("targetLang") String targetLang,
            @RequestParam("sourceLang") String sourceLang ) {
        try {
            // 1. Get audio bytes from the uploaded file
            byte[] audioData = file.getBytes();

            // 2. Convert speech to text using the cloud-based Google API
            String originalText = googleApiService.speechToText(audioData, sourceLang);
            if (originalText.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Could not transcribe audio."));
            }

            // 3. Translate the transcribed text using the cloud-based Google API
            String translatedText = googleApiService.translateText(originalText, targetLang);

            // 4. Convert the translated text back to speech using the cloud-based Google API
            byte[] translatedAudio = googleApiService.textToSpeech(translatedText, targetLang);
            String translatedAudioBase64 = Base64.getEncoder().encodeToString(translatedAudio);

            // 5. Return the results in a JSON response
            Map<String, String> response = Map.of(
                    "originalText", originalText,
                    "translatedText", translatedText,
                    "translatedAudio", translatedAudioBase64
            );
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred while processing the request: " + e.getMessage()));
        }
    }

    /**
     * Endpoint to handle text translation and text-to-speech.
     * @param text The text to be translated.
     * @param targetLang The target language code (e.g., "es", "fr").
     * @return A JSON object with original text, translated text, and Base64 encoded audio.
     */
    @PostMapping("/text")
    public ResponseEntity<?> translateText(
            @RequestParam("text") String text,
            @RequestParam("targetLang") String targetLang)
            {
        try {
            System.out.println("Text: " + text);
            // 1. Translate the input text using the cloud-based Google API
            String translatedText = googleApiService.translateText(text, targetLang);

            System.out.println("Text: " + translatedText);

            // 2. Convert the translated text to speech using the cloud-based Google API
            byte[] translatedAudio = googleApiService.textToSpeech(translatedText, targetLang);
            String translatedAudioBase64 = Base64.getEncoder().encodeToString(translatedAudio);

            // 3. Return the results in a JSON response
            Map<String, String> response = Map.of(
                    "originalText", text,
                    "translatedText", translatedText,
                    "translatedAudio", translatedAudioBase64
            );
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred while processing the request: " + e.getMessage()));
        }
    }
}

