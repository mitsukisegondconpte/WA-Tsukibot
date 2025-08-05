import { storage } from '../storage';
import { languageManager } from './languageManager';

class GameEngine {
  async startGame(gameType: string, phoneNumber: string, language: string, message: any, whatsappService: any) {
    // End any existing games first
    await this.endActiveGames(phoneNumber);

    switch (gameType) {
      case 'ticTacToe':
        await this.startTicTacToe(phoneNumber, language, message);
        break;
      case 'emojiQuiz':
        await this.startEmojiQuiz(phoneNumber, language, message);
        break;
      case 'wordGuess':
        await this.startWordGuess(phoneNumber, language, message);
        break;
      case 'riddles':
        await this.startRiddles(phoneNumber, language, message);
        break;
    }

    // Update games played count
    const stats = await storage.getBotStats();
    const newCount = parseInt(stats.gamesPlayed) + 1;
    await storage.updateBotStats({ gamesPlayed: newCount.toString() });
  }

  async startTicTacToe(phoneNumber: string, language: string, message: any) {
    const gameState = {
      board: Array(9).fill(''),
      currentPlayer: 'X',
      gameOver: false,
      winner: null
    };

    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'ticTacToe',
      state: gameState,
      language
    });

    const response = languageManager.getTicTacToeStart(language) + '\n\n' + this.formatTicTacToeBoard(gameState.board);
    await message.reply(response);
  }

  async startEmojiQuiz(phoneNumber: string, language: string, message: any) {
    const userSession = await storage.getUserSession(phoneNumber);
    const usedQuestions = (userSession?.usedQuestions as string[]) || [];
    
    const question = languageManager.getEmojiQuestion(language, usedQuestions);
    if (!question) {
      await message.reply(languageManager.getMessage('noMoreQuestions', language));
      return;
    }

    const gameState = {
      currentQuestion: question,
      attempts: 0,
      maxAttempts: 3
    };

    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'emojiQuiz',
      state: gameState,
      language
    });

    // Add question to used questions
    const newUsedQuestions = [...usedQuestions, question.id];
    await storage.updateUserSession(phoneNumber, { usedQuestions: newUsedQuestions });

    const response = languageManager.getEmojiQuizStart(language) + '\n\n' + question.emoji + '\n\n' + 
                    languageManager.getMessage('guessWord', language);
    await message.reply(response);
  }

  async startWordGuess(phoneNumber: string, language: string, message: any) {
    const userSession = await storage.getUserSession(phoneNumber);
    const usedQuestions = (userSession?.usedQuestions as string[]) || [];
    
    const word = languageManager.getWordGuessWord(language, usedQuestions);
    if (!word) {
      await message.reply(languageManager.getMessage('noMoreQuestions', language));
      return;
    }

    const gameState = {
      word: word.word.toLowerCase(),
      hint: word.hint,
      guessedLetters: [],
      wrongGuesses: 0,
      maxWrongGuesses: 6,
      gameOver: false
    };

    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'wordGuess',
      state: gameState,
      language
    });

    // Add word to used questions
    const newUsedQuestions = [...usedQuestions, word.id];
    await storage.updateUserSession(phoneNumber, { usedQuestions: newUsedQuestions });

    const response = languageManager.getWordGuessStart(language) + '\n\n' +
                    languageManager.getMessage('hint', language) + ': ' + word.hint + '\n\n' +
                    this.formatWordGuess(gameState);
    await message.reply(response);
  }

  async startRiddles(phoneNumber: string, language: string, message: any) {
    const userSession = await storage.getUserSession(phoneNumber);
    const usedQuestions = (userSession?.usedQuestions as string[]) || [];
    
    const riddle = languageManager.getRiddle(language, usedQuestions);
    if (!riddle) {
      await message.reply(languageManager.getMessage('noMoreQuestions', language));
      return;
    }

    const gameState = {
      riddle: riddle,
      attempts: 0,
      maxAttempts: 3,
      solved: false
    };

    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'riddles',
      state: gameState,
      language
    });

    // Add riddle to used questions
    const newUsedQuestions = [...usedQuestions, riddle.id];
    await storage.updateUserSession(phoneNumber, { usedQuestions: newUsedQuestions });

    const response = languageManager.getRiddleStart(language) + '\n\n' + riddle.question;
    await message.reply(response);
  }

  async handleGameInput(gameState: any, input: string, phoneNumber: string, message: any, whatsappService: any) {
    switch (gameState.gameType) {
      case 'ticTacToe':
        await this.handleTicTacToeInput(gameState, input, phoneNumber, message);
        break;
      case 'emojiQuiz':
        await this.handleEmojiQuizInput(gameState, input, phoneNumber, message);
        break;
      case 'wordGuess':
        await this.handleWordGuessInput(gameState, input, phoneNumber, message);
        break;
      case 'riddles':
        await this.handleRiddleInput(gameState, input, phoneNumber, message);
        break;
    }
  }

  async handleTicTacToeInput(gameState: any, input: string, phoneNumber: string, message: any) {
    const position = parseInt(input) - 1;
    if (isNaN(position) || position < 0 || position > 8) {
      const response = languageManager.getMessage('invalidPosition', gameState.language);
      await message.reply(response);
      return;
    }

    const state = gameState.state;
    if (state.board[position] !== '') {
      const response = languageManager.getMessage('positionTaken', gameState.language);
      await message.reply(response);
      return;
    }

    // Player move
    state.board[position] = 'X';

    // Check for win or tie
    if (this.checkTicTacToeWin(state.board, 'X')) {
      state.gameOver = true;
      state.winner = 'X';
      await storage.deleteGameState(phoneNumber, 'ticTacToe');
      const response = this.formatTicTacToeBoard(state.board) + '\n\n' + 
                     languageManager.getMessage('youWin', gameState.language);
      await message.reply(response);
      return;
    }

    if (this.checkTicTacToeTie(state.board)) {
      state.gameOver = true;
      await storage.deleteGameState(phoneNumber, 'ticTacToe');
      const response = this.formatTicTacToeBoard(state.board) + '\n\n' + 
                     languageManager.getMessage('tie', gameState.language);
      await message.reply(response);
      return;
    }

    // Bot move
    const botMove = this.getBestTicTacToeMove(state.board);
    state.board[botMove] = 'O';

    // Check for bot win
    if (this.checkTicTacToeWin(state.board, 'O')) {
      state.gameOver = true;
      state.winner = 'O';
      await storage.deleteGameState(phoneNumber, 'ticTacToe');
      const response = this.formatTicTacToeBoard(state.board) + '\n\n' + 
                     languageManager.getMessage('botWins', gameState.language);
      await message.reply(response);
      return;
    }

    if (this.checkTicTacToeTie(state.board)) {
      state.gameOver = true;
      await storage.deleteGameState(phoneNumber, 'ticTacToe');
      const response = this.formatTicTacToeBoard(state.board) + '\n\n' + 
                     languageManager.getMessage('tie', gameState.language);
      await message.reply(response);
      return;
    }

    // Update game state and continue
    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'ticTacToe',
      state: state,
      language: gameState.language
    });

    const response = this.formatTicTacToeBoard(state.board) + '\n\n' + 
                    languageManager.getMessage('yourTurn', gameState.language);
    await message.reply(response);
  }

  async handleEmojiQuizInput(gameState: any, input: string, phoneNumber: string, message: any) {
    const state = gameState.state;
    const correctAnswer = state.currentQuestion.answer.toLowerCase();
    const userAnswer = input.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      await storage.deleteGameState(phoneNumber, 'emojiQuiz');
      const response = languageManager.getMessage('correct', gameState.language) + ' 🎉\n' +
                     languageManager.getMessage('answer', gameState.language) + ': ' + state.currentQuestion.answer;
      await message.reply(response);
    } else {
      state.attempts++;
      if (state.attempts >= state.maxAttempts) {
        await storage.deleteGameState(phoneNumber, 'emojiQuiz');
        const response = languageManager.getMessage('gameOver', gameState.language) + '\n' +
                       languageManager.getMessage('answer', gameState.language) + ': ' + state.currentQuestion.answer;
        await message.reply(response);
      } else {
        await storage.saveGameState({
          userId: phoneNumber,
          gameType: 'emojiQuiz',
          state: state,
          language: gameState.language
        });
        const remaining = state.maxAttempts - state.attempts;
        const response = languageManager.getMessage('wrong', gameState.language) + '\n' +
                       languageManager.getMessage('attemptsLeft', gameState.language).replace('{attempts}', remaining.toString());
        await message.reply(response);
      }
    }
  }

  async handleWordGuessInput(gameState: any, input: string, phoneNumber: string, message: any) {
    const state = gameState.state;
    const letter = input.toLowerCase().trim();

    if (letter.length !== 1 || !/[a-z]/.test(letter)) {
      const response = languageManager.getMessage('invalidLetter', gameState.language);
      await message.reply(response);
      return;
    }

    if (state.guessedLetters.includes(letter)) {
      const response = languageManager.getMessage('alreadyGuessed', gameState.language);
      await message.reply(response);
      return;
    }

    state.guessedLetters.push(letter);

    if (state.word.includes(letter)) {
      // Check if word is complete
      const wordDisplay = this.getWordDisplay(state.word, state.guessedLetters);
      if (!wordDisplay.includes('_')) {
        state.gameOver = true;
        await storage.deleteGameState(phoneNumber, 'wordGuess');
        const response = languageManager.getMessage('wordComplete', gameState.language) + ' 🎉\n' +
                       languageManager.getMessage('word', gameState.language) + ': ' + state.word.toUpperCase();
        await message.reply(response);
        return;
      }
    } else {
      state.wrongGuesses++;
      if (state.wrongGuesses >= state.maxWrongGuesses) {
        state.gameOver = true;
        await storage.deleteGameState(phoneNumber, 'wordGuess');
        const response = languageManager.getMessage('gameOver', gameState.language) + '\n' +
                       languageManager.getMessage('word', gameState.language) + ': ' + state.word.toUpperCase();
        await message.reply(response);
        return;
      }
    }

    await storage.saveGameState({
      userId: phoneNumber,
      gameType: 'wordGuess',
      state: state,
      language: gameState.language
    });

    const response = this.formatWordGuess(state);
    await message.reply(response);
  }

  async handleRiddleInput(gameState: any, input: string, phoneNumber: string, message: any) {
    const state = gameState.state;
    const correctAnswer = state.riddle.answer.toLowerCase();
    const userAnswer = input.toLowerCase().trim();

    if (userAnswer === correctAnswer || this.isAnswerClose(userAnswer, correctAnswer)) {
      state.solved = true;
      await storage.deleteGameState(phoneNumber, 'riddles');
      const response = languageManager.getMessage('correct', gameState.language) + ' 🎉\n' +
                     languageManager.getMessage('answer', gameState.language) + ': ' + state.riddle.answer;
      await message.reply(response);
    } else {
      state.attempts++;
      if (state.attempts >= state.maxAttempts) {
        await storage.deleteGameState(phoneNumber, 'riddles');
        const response = languageManager.getMessage('gameOver', gameState.language) + '\n' +
                       languageManager.getMessage('answer', gameState.language) + ': ' + state.riddle.answer;
        await message.reply(response);
      } else {
        await storage.saveGameState({
          userId: phoneNumber,
          gameType: 'riddles',
          state: state,
          language: gameState.language
        });
        const remaining = state.maxAttempts - state.attempts;
        const response = languageManager.getMessage('wrong', gameState.language) + '\n' +
                       languageManager.getMessage('attemptsLeft', gameState.language).replace('{attempts}', remaining.toString());
        await message.reply(response);
      }
    }
  }

  private async endActiveGames(phoneNumber: string) {
    const gameTypes = ['ticTacToe', 'emojiQuiz', 'wordGuess', 'riddles'];
    for (const gameType of gameTypes) {
      await storage.deleteGameState(phoneNumber, gameType);
    }
  }

  private formatTicTacToeBoard(board: string[]): string {
    const symbols = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const displayBoard = board.map((cell, index) => {
      if (cell === 'X') return '❌';
      if (cell === 'O') return '⭕';
      return symbols[index];
    });

    return `${displayBoard[0]}${displayBoard[1]}${displayBoard[2]}\n${displayBoard[3]}${displayBoard[4]}${displayBoard[5]}\n${displayBoard[6]}${displayBoard[7]}${displayBoard[8]}`;
  }

  private formatWordGuess(state: any): string {
    const wordDisplay = this.getWordDisplay(state.word, state.guessedLetters);
    const wrongLetters = state.guessedLetters.filter((letter: string) => !state.word.includes(letter));
    const remaining = state.maxWrongGuesses - state.wrongGuesses;

    return `${wordDisplay}\n\n` +
           `❌ ${wrongLetters.join(' ').toUpperCase()}\n` +
           `💔 ${remaining} chances left`;
  }

  private getWordDisplay(word: string, guessedLetters: string[]): string {
    return word.split('').map(letter => guessedLetters.includes(letter) ? letter.toUpperCase() : '_').join(' ');
  }

  private checkTicTacToeWin(board: string[], player: string): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => 
      pattern.every(index => board[index] === player)
    );
  }

  private checkTicTacToeTie(board: string[]): boolean {
    return board.every(cell => cell !== '');
  }

  private getBestTicTacToeMove(board: string[]): number {
    // Simple AI: try to win, then block, then take center, then corners
    const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    
    // Try to win
    for (let move of availableMoves) {
      const testBoard = [...board];
      testBoard[move as number] = 'O';
      if (this.checkTicTacToeWin(testBoard, 'O')) {
        return move as number;
      }
    }

    // Try to block
    for (let move of availableMoves) {
      const testBoard = [...board];
      testBoard[move as number] = 'X';
      if (this.checkTicTacToeWin(testBoard, 'X')) {
        return move as number;
      }
    }

    // Take center
    if (availableMoves.includes(4)) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
  }

  private isAnswerClose(userAnswer: string, correctAnswer: string): boolean {
    // Simple similarity check for riddles
    if (userAnswer.length < 3 || correctAnswer.length < 3) return false;
    
    const similarity = this.calculateSimilarity(userAnswer, correctAnswer);
    return similarity > 0.8; // 80% similarity threshold
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
  }
}

export const gameEngine = new GameEngine();