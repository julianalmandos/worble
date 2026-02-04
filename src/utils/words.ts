import englishWords from './english_words'
import spanishWords from './spanish_words'

export enum Language {
  English = 'English',
  Spanish = 'Spanish',
}

const LANGUAGE_TO_DICTIONARY: Record<Language, string[]> = {
  [Language.English]: englishWords,
  [Language.Spanish]: spanishWords,
}

export const getRandomWord = (language: Language): string => {
  return LANGUAGE_TO_DICTIONARY[language][
    Math.floor(Math.random() * LANGUAGE_TO_DICTIONARY[language].length)
  ] as string
}

export const doesWordExist = (language: Language, word: string): boolean => {
  return LANGUAGE_TO_DICTIONARY[language].includes(word)
}
