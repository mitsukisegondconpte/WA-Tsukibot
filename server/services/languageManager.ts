class LanguageManager {
  private messages = {
    en: {
      welcome: `Hello! 👋
Choose your language:
🇫🇷 Type .fr for French
🇺🇸 Type .en for English

Use .help to see available commands`,
      languageChanged: 'Language changed to English ✅',
      unknownCommand: 'Unknown command. Type .help for available commands.',
      help: 'Available commands:\n.tictactoe - Play Tic Tac Toe\n.emojiquiz - Emoji Quiz\n.mokache - Word Guessing\n.riddle - Riddles\n.fr - French\n.en - English',
      yourTurn: 'Your turn! Choose position (1-9):',
      invalidPosition: 'Invalid position. Choose 1-9.',
      positionTaken: 'Position already taken. Choose another.',
      youWin: 'You win! 🎉',
      botWins: 'I win! 🤖',
      tie: "It's a tie! 🤝",
      correct: 'Correct!',
      wrong: 'Wrong!',
      answer: 'Answer',
      gameOver: 'Game Over!',
      attemptsLeft: '{attempts} attempts left',
      guessWord: 'Guess the word:',
      hint: 'Hint',
      invalidLetter: 'Please enter a single letter.',
      alreadyGuessed: 'You already guessed that letter.',
      wordComplete: 'Word complete!',
      word: 'Word',
      noMoreQuestions: 'No more questions available. Try again later!'
    },
    fr: {
      welcome: `Bonjou! 👋
Chwazi lang ou:
🇫🇷 Tapez .fr pour Français
🇺🇸 Tapez .en pour Anglais

Utilisez .aide pour voir les commandes disponibles`,
      languageChanged: 'Langue changée en Français ✅',
      unknownCommand: 'Commande inconnue. Tapez .aide pour les commandes disponibles.',
      help: 'Commandes disponibles:\n.tictactoe - Jouer Tic Tac Toe\n.emojiquiz - Quiz Emoji\n.mokache - Deviner le mot\n.riddle - Devinettes\n.fr - Français\n.en - Anglais',
      yourTurn: 'Votre tour! Choisissez position (1-9):',
      invalidPosition: 'Position invalide. Choisissez 1-9.',
      positionTaken: 'Position déjà prise. Choisissez une autre.',
      youWin: 'Vous gagnez! 🎉',
      botWins: 'Je gagne! 🤖',
      tie: 'Égalité! 🤝',
      correct: 'Correct!',
      wrong: 'Faux!',
      answer: 'Réponse',
      gameOver: 'Jeu terminé!',
      attemptsLeft: '{attempts} tentatives restantes',
      guessWord: 'Devinez le mot:',
      hint: 'Indice',
      invalidLetter: 'Veuillez entrer une seule lettre.',
      alreadyGuessed: 'Vous avez déjà deviné cette lettre.',
      wordComplete: 'Mot complet!',
      word: 'Mot',
      noMoreQuestions: 'Plus de questions disponibles. Réessayez plus tard!'
    }
  };

  private gameMessages = {
    en: {
      ticTacToeStart: '🎮 Tic Tac Toe Started!\nYou are X, I am O',
      emojiQuizStart: '🎯 Emoji Quiz Started!',
      wordGuessStart: '🔤 Word Guessing Started!',
      riddleStart: '🧩 Riddle Time!'
    },
    fr: {
      ticTacToeStart: '🎮 Tic Tac Toe Commencé!\nVous êtes X, je suis O',
      emojiQuizStart: '🎯 Quiz Emoji Commencé!',
      wordGuessStart: '🔤 Deviner le Mot Commencé!',
      riddleStart: '🧩 Temps des Devinettes!'
    }
  };

  private emojiQuestions = {
    en: [
      { id: 'en_1', emoji: '🍕🍝🇮🇹', answer: 'italy', hint: 'Country known for pasta' },
      { id: 'en_2', emoji: '☀️🏖️🏄‍♂️', answer: 'beach', hint: 'Place to surf' },
      { id: 'en_3', emoji: '🚗💨⛽', answer: 'car', hint: 'Vehicle that needs gas' },
      { id: 'en_4', emoji: '📱💬👥', answer: 'chat', hint: 'Talking with friends' },
      { id: 'en_5', emoji: '🎵🎤🎧', answer: 'music', hint: 'What you listen to' },
      { id: 'en_6', emoji: '🍎🥕🥗', answer: 'healthy', hint: 'Good for you' },
      { id: 'en_7', emoji: '🏠🛏️😴', answer: 'sleep', hint: 'What you do in bed' },
      { id: 'en_8', emoji: '📚✏️🎓', answer: 'study', hint: 'What students do' },
      { id: 'en_9', emoji: '⚽🏟️🏆', answer: 'football', hint: 'Popular sport' },
      { id: 'en_10', emoji: '🎂🎉🎈', answer: 'party', hint: 'Celebration time' }
    ],
    fr: [
      { id: 'fr_1', emoji: '🍕🍝🇮🇹', answer: 'italie', hint: 'Pays connu pour les pâtes' },
      { id: 'fr_2', emoji: '☀️🏖️🏄‍♂️', answer: 'plage', hint: 'Endroit pour surfer' },
      { id: 'fr_3', emoji: '🚗💨⛽', answer: 'voiture', hint: 'Véhicule qui a besoin d\'essence' },
      { id: 'fr_4', emoji: '📱💬👥', answer: 'chat', hint: 'Parler avec des amis' },
      { id: 'fr_5', emoji: '🎵🎤🎧', answer: 'musique', hint: 'Ce que vous écoutez' },
      { id: 'fr_6', emoji: '🍎🥕🥗', answer: 'sain', hint: 'Bon pour vous' },
      { id: 'fr_7', emoji: '🏠🛏️😴', answer: 'dormir', hint: 'Ce que vous faites au lit' },
      { id: 'fr_8', emoji: '📚✏️🎓', answer: 'étudier', hint: 'Ce que font les étudiants' },
      { id: 'fr_9', emoji: '⚽🏟️🏆', answer: 'football', hint: 'Sport populaire' },
      { id: 'fr_10', emoji: '🎂🎉🎈', answer: 'fête', hint: 'Temps de célébration' }
    ]
  };

  private wordGuessWords = {
    en: [
      { id: 'word_en_1', word: 'ELEPHANT', hint: 'Large African animal with trunk' },
      { id: 'word_en_2', word: 'RAINBOW', hint: 'Colorful arc in the sky' },
      { id: 'word_en_3', word: 'GUITAR', hint: 'Musical instrument with strings' },
      { id: 'word_en_4', word: 'BUTTERFLY', hint: 'Flying insect with colorful wings' },
      { id: 'word_en_5', word: 'MOUNTAIN', hint: 'Very high land formation' },
      { id: 'word_en_6', word: 'TREASURE', hint: 'Hidden valuable items' },
      { id: 'word_en_7', word: 'ADVENTURE', hint: 'Exciting journey or experience' },
      { id: 'word_en_8', word: 'CHOCOLATE', hint: 'Sweet brown treat' },
      { id: 'word_en_9', word: 'FRIENDSHIP', hint: 'Bond between friends' },
      { id: 'word_en_10', word: 'SUNSHINE', hint: 'Light from the sun' }
    ],
    fr: [
      { id: 'word_fr_1', word: 'ELEPHANT', hint: 'Grand animal africain avec une trompe' },
      { id: 'word_fr_2', word: 'ARCENCIEL', hint: 'Arc coloré dans le ciel' },
      { id: 'word_fr_3', word: 'GUITARE', hint: 'Instrument de musique à cordes' },
      { id: 'word_fr_4', word: 'PAPILLON', hint: 'Insecte volant aux ailes colorées' },
      { id: 'word_fr_5', word: 'MONTAGNE', hint: 'Formation terrestre très haute' },
      { id: 'word_fr_6', word: 'TRESOR', hint: 'Objets précieux cachés' },
      { id: 'word_fr_7', word: 'AVENTURE', hint: 'Voyage ou expérience passionnante' },
      { id: 'word_fr_8', word: 'CHOCOLAT', hint: 'Friandise brune sucrée' },
      { id: 'word_fr_9', word: 'AMITIE', hint: 'Lien entre amis' },
      { id: 'word_fr_10', word: 'SOLEIL', hint: 'Lumière du soleil' }
    ]
  };

  private riddles = {
    en: [
      { id: 'riddle_en_1', question: 'I have keys but no locks. I have space but no room. You can enter but not go outside. What am I?', answer: 'keyboard' },
      { id: 'riddle_en_2', question: 'The more you take, the more you leave behind. What am I?', answer: 'footsteps' },
      { id: 'riddle_en_3', question: 'I am tall when I am young, and I am short when I am old. What am I?', answer: 'candle' },
      { id: 'riddle_en_4', question: 'What has hands but cannot clap?', answer: 'clock' },
      { id: 'riddle_en_5', question: 'What gets wet while drying?', answer: 'towel' },
      { id: 'riddle_en_6', question: 'I speak without a mouth and hear without ears. What am I?', answer: 'echo' },
      { id: 'riddle_en_7', question: 'What can travel around the world while staying in a corner?', answer: 'stamp' },
      { id: 'riddle_en_8', question: 'I have cities, but no houses. I have mountains, but no trees. What am I?', answer: 'map' },
      { id: 'riddle_en_9', question: 'What breaks but never falls, and what falls but never breaks?', answer: 'day and night' },
      { id: 'riddle_en_10', question: 'I am always hungry and will die if not fed, but whatever I touch will soon turn red. What am I?', answer: 'fire' }
    ],
    fr: [
      { id: 'riddle_fr_1', question: 'Plus on m\'ôte, plus je grandis. Que suis-je?', answer: 'trou' },
      { id: 'riddle_fr_2', question: 'Je suis grand quand je suis jeune, et petit quand je suis vieux. Que suis-je?', answer: 'bougie' },
      { id: 'riddle_fr_3', question: 'Qu\'est-ce qui a des dents mais ne peut pas mordre?', answer: 'peigne' },
      { id: 'riddle_fr_4', question: 'Je vole sans ailes et je pleure sans yeux. Que suis-je?', answer: 'nuage' },
      { id: 'riddle_fr_5', question: 'Plus on en prend, plus on en laisse. Que suis-je?', answer: 'pas' },
      { id: 'riddle_fr_6', question: 'Qu\'est-ce qui se mouille en séchant?', answer: 'serviette' },
      { id: 'riddle_fr_7', question: 'Je parle sans bouche et j\'entends sans oreilles. Que suis-je?', answer: 'écho' },
      { id: 'riddle_fr_8', question: 'Qu\'est-ce qui peut voyager autour du monde en restant dans un coin?', answer: 'timbre' },
      { id: 'riddle_fr_9', question: 'J\'ai des villes mais pas de maisons. J\'ai des montagnes mais pas d\'arbres. Que suis-je?', answer: 'carte' },
      { id: 'riddle_fr_10', question: 'Qu\'est-ce qui se casse sans jamais tomber, et qu\'est-ce qui tombe sans jamais se casser?', answer: 'jour et nuit' }
    ]
  };

  getMessage(key: string, language: string): string {
    const lang = language as 'en' | 'fr';
    return this.messages[lang]?.[key as keyof typeof this.messages.en] || this.messages.en[key as keyof typeof this.messages.en] || key;
  }

  getTicTacToeStart(language: string): string {
    const lang = language as 'en' | 'fr';
    return this.gameMessages[lang]?.ticTacToeStart || this.gameMessages.en.ticTacToeStart;
  }

  getEmojiQuizStart(language: string): string {
    const lang = language as 'en' | 'fr';
    return this.gameMessages[lang]?.emojiQuizStart || this.gameMessages.en.emojiQuizStart;
  }

  getWordGuessStart(language: string): string {
    const lang = language as 'en' | 'fr';
    return this.gameMessages[lang]?.wordGuessStart || this.gameMessages.en.wordGuessStart;
  }

  getRiddleStart(language: string): string {
    const lang = language as 'en' | 'fr';
    return this.gameMessages[lang]?.riddleStart || this.gameMessages.en.riddleStart;
  }

  getHelpMessage(language: string, gameSettings: any[]): string {
    const lang = language as 'en' | 'fr';
    let help = this.getMessage('help', language) + '\n\n';
    
    gameSettings.forEach(game => {
      if (game.enabled) {
        help += `${game.command} - ${game.description}\n`;
      }
    });
    
    return help.trim();
  }

  getEmojiQuestion(language: string, usedQuestions: string[]): any {
    const lang = language as 'en' | 'fr';
    const questions = this.emojiQuestions[lang] || this.emojiQuestions.en;
    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));
    
    if (availableQuestions.length === 0) {
      return null;
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  getWordGuessWord(language: string, usedQuestions: string[]): any {
    const lang = language as 'en' | 'fr';
    const words = this.wordGuessWords[lang] || this.wordGuessWords.en;
    const availableWords = words.filter(w => !usedQuestions.includes(w.id));
    
    if (availableWords.length === 0) {
      return null;
    }
    
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }

  getRiddle(language: string, usedQuestions: string[]): any {
    const lang = language as 'en' | 'fr';
    const riddles = this.riddles[lang] || this.riddles.en;
    const availableRiddles = riddles.filter(r => !usedQuestions.includes(r.id));
    
    if (availableRiddles.length === 0) {
      return null;
    }
    
    return availableRiddles[Math.floor(Math.random() * availableRiddles.length)];
  }
}

export const languageManager = new LanguageManager();
