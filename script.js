// 게임 상태
let currentLevel = null;
let currentWords = [];
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let usedWords = [];
const TOTAL_QUESTIONS = 10;

// DOM 요소
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const levelButtons = document.querySelectorAll('.level-btn');
const backBtn = document.getElementById('back-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const wordKorean = document.getElementById('word-korean');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const correctCountDisplay = document.getElementById('correct-count');
const wrongCountDisplay = document.getElementById('wrong-count');
const progressFill = document.getElementById('progress-fill');

// 레벨 선택 이벤트
levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        startGame(level);
    });
});

// 뒤로가기 버튼
backBtn.addEventListener('click', () => {
    if (confirm('게임을 중단하시겠습니까?')) {
        showMainMenu();
    }
});

// 다시하기 버튼
restartBtn.addEventListener('click', () => {
    startGame(currentLevel);
});

// 홈으로 버튼
homeBtn.addEventListener('click', () => {
    showMainMenu();
});

// 게임 시작
function startGame(level) {
    currentLevel = level;
    currentWords = [...wordData[level]];
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    usedWords = [];
    
    // 화면 전환
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    // 점수 초기화
    updateScore();
    updateProgress();
    
    // 첫 문제 표시
    showQuestion();
}

// 문제 표시
function showQuestion() {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }
    
    // 사용하지 않은 단어 중 랜덤 선택
    const availableWords = currentWords.filter(w => !usedWords.includes(w.word));
    if (availableWords.length === 0) {
        // 모든 단어를 사용했으면 다시 시작
        usedWords = [];
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const currentWord = availableWords[randomIndex];
    usedWords.push(currentWord.word);
    
    // 한국어 뜻 표시
    wordKorean.textContent = currentWord.meaning;
    
    // 옵션 생성 (정답 + 오답 3개)
    const options = [currentWord];
    const wrongOptions = currentWords
        .filter(w => w.word !== currentWord.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    options.push(...wrongOptions);
    
    // 옵션 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 옵션 버튼 생성
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.word;
        button.dataset.correct = option.word === currentWord.word;
        button.addEventListener('click', () => handleAnswer(button));
        optionsContainer.appendChild(button);
    });
    
    // 피드백 초기화
    feedback.textContent = '';
    feedback.className = 'feedback-message';
}

// 답변 처리
function handleAnswer(button) {
    const isCorrect = button.dataset.correct === 'true';
    const allButtons = document.querySelectorAll('.option-btn');
    
    // 모든 버튼 비활성화
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        } else if (btn === button && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 결과 처리
    if (isCorrect) {
        score += 10;
        correctCount++;
        feedback.textContent = '정답입니다! 🎉';
        feedback.className = 'feedback-message correct';
    } else {
        wrongCount++;
        const correctButton = Array.from(allButtons).find(b => b.dataset.correct === 'true');
        const correctAnswer = correctButton ? correctButton.textContent : '';
        feedback.textContent = `틀렸습니다. 정답은 "${correctAnswer}" 입니다.`;
        feedback.className = 'feedback-message wrong';
    }
    
    updateScore();
    updateProgress();
    
    // 다음 문제로
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

// 점수 업데이트
function updateScore() {
    scoreDisplay.textContent = score;
    correctCountDisplay.textContent = correctCount;
    wrongCountDisplay.textContent = wrongCount;
}

// 진행도 업데이트
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = `${progress}%`;
}

// 게임 종료
function endGame() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const totalQuestions = correctCount + wrongCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-correct').textContent = correctCount;
    document.getElementById('final-wrong').textContent = wrongCount;
}

// 메인 메뉴 표시
function showMainMenu() {
    mainMenu.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
}

