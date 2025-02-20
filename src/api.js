export const translateText = async (text, sourceLang, targetLang) => {
  if (!window.translation) {
    console.error("Translation API not available");
    return;
  }

  try {
    const translatedText = await window.translation.translateText({
      text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang
    });

    console.log("Translated Text:", translatedText);
  } catch (error) {
    console.error("Translation error:  gradient-to-br from-[#f4f4f4] via-white to-[#dbeafe]", error);
  }
};

