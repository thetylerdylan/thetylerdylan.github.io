const TEAM_MEMBERS = {
    'Wise Eyes': ['Aesop', 'Lara', 'Ronan', 'Quincy'],
    'BOBOs': ['Archer', 'Matthew', 'Jordynn', 'Seth', 'Matilda']
};

function App() {
    const [gameState, setGameState] = React.useState('title');
    const [team, setTeam] = React.useState('');
    const [character, setCharacter] = React.useState('');
    const [questions, setQuestions] = React.useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(30);
    const [answered, setAnswered] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [answersHistory, setAnswersHistory] = React.useState([]);
    const [questionCount, setQuestionCount] = React.useState(20);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [lastAnswerCorrect, setLastAnswerCorrect] = React.useState(false);

    // Question Loading Effect
    React.useEffect(() => {
        if (gameState === 'playing' || gameState === 'review') {
            loadQuestions();
        }
    }, [gameState, questionCount]);

    // Timer Effect
    React.useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0 && !answered) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, answered]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetch('OBOBquestions.csv');
            const text = await response.text();
            
            const parsedData = Papa.parse(text, {
                header: true,
                skipEmptyLines: true
            });
            
            const iwbQuestions = parsedData.data.filter(q => q.qtype === 'iwb');
            const shuffledQuestions = iwbQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, questionCount);
            
            const questionsWithOptions = shuffledQuestions.map(question => {
                const otherBooks = new Set(iwbQuestions.map(q => q.book));
                otherBooks.delete(question.book);
                const options = [...Array.from(otherBooks)]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                
                return {
                    ...question,
                    options: [...options, question.book].sort(() => Math.random() - 0.5)
                };
            });
            
            setQuestions(questionsWithOptions);
            setLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            setLoading(false);
        }
    };

    const handleTimeUp = () => {
        if (!answered) {
            setAnswered(true);
            setAnswersHistory(prev => [...prev, false]);
            setTimeout(nextQuestion, 2000);
        }
    };

    const nextQuestion = () => {
        setShowFeedback(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setAnswered(false);
            setTimeLeft(30);
        } else {
            setGameState('finished');
        }
    };

    const handleAnswer = (selectedBook) => {
        if (answered) return;
        
        setAnswered(true);
        const correct = selectedBook === questions[currentQuestionIndex].book;
        setLastAnswerCorrect(correct);
        setAnswersHistory(prev => [...prev, correct]);
        
        if (correct) {
            setScore(s => s + 1);
        }
        
        setShowFeedback(true);
        setTimeout(() => {
            setShowFeedback(false);
            setTimeout(nextQuestion, 1000);
        }, 1000);
    };

    const renderTitle = () => (
        <>
            <h1 className="title">OREGON BATTLE OF THE BOOKS</h1>
            <button className="button" onClick={() => setGameState('team')}>
                START YOUR QUEST
            </button>
        </>
    );

    const renderTeamSelect = () => (
        <>
            <h2 className="subtitle">SELECT YOUR TEAM</h2>
            <div className="team-grid">
                {Object.keys(TEAM_MEMBERS).map((teamName) => (
                    <div 
                        key={teamName}
                        className={`team-card ${team === teamName ? 'selected' : ''}`}
                        onClick={() => setTeam(teamName)}
                    >
                        <h3>{teamName}</h3>
                        <p>{TEAM_MEMBERS[teamName].join(', ')}</p>
                    </div>
                ))}
            </div>
            {team && (
                <>
                    <h3 className="subtitle">SELECT YOUR CHARACTER</h3>
                    <div className="character-select">
                        {TEAM_MEMBERS[team].map((memberName) => (
                            <button 
                                key={memberName}
                                className={`character-button ${character === memberName ? 'selected' : ''}`}
                                onClick={() => setCharacter(memberName)}
                            >
                                {memberName}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {character && (
                <button 
                    className="button" 
                    onClick={() => setGameState('mode')}
                >
                    BEGIN QUEST
                </button>
            )}
        </>
    );

    const renderGameModeSelect = () => (
        <>
            <h2 className="subtitle">CHOOSE YOUR CHALLENGE</h2>
            
            <div className="retro-window">
                <h3 className="subtitle">IWB Quiz Challenge</h3>
                <div className="character-select">
                    <button 
                        className="button"
                        onClick={() => {
                            setQuestionCount(10);
                            setGameState('playing');
                        }}
                    >
                        10 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => {
                            setQuestionCount(20);
                            setGameState('playing');
                        }}
                    >
                        20 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => {
                            setQuestionCount(30);
                            setGameState('playing');
                        }}
                    >
                        30 Questions
                    </button>
                </div>
            </div>

            <div className="retro-window">
                <h3 className="subtitle">Content Review</h3>
                <p className="review-text">Practice with questions at your own pace.</p>
                <button 
                    className="button"
                    onClick={() => setGameState('review')}
                >
                    Start Review
                </button>
            </div>
        </>
    );

    const renderPlaying = () => {
        if (loading || !questions.length) {
            return <div className="subtitle">Loading questions...</div>;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const timerPercentage = (timeLeft / 30) * 100;

        return (
            <div className="retro-window">
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                    <div>Score: {score}</div>
                    <div>Time: {timeLeft}s</div>
                </div>

                <div className="timer-bar">
                    <div 
                        className="timer-fill"
                        style={{width: `${timerPercentage}%`}}
                    />
                </div>

                <h3 className="subtitle">Question {currentQuestionIndex + 1}</h3>
                <p>{currentQuestion.question}</p>
                
                <div className="character-select">
                    {currentQuestion.options.map((book) => (
                        <button
                            key={book}
                            className={`answer-button ${
                                answered 
                                    ? book === currentQuestion.book 
                                        ? 'correct'
                                        : 'incorrect'
                                    : ''
                            }`}
                            onClick={() => handleAnswer(book)}
                            disabled={answered}
                        >
                            {book}
                        </button>
                    ))}
                </div>

                {showFeedback && (
                    <div className="answer-feedback">
                        {lastAnswerCorrect ? '✓' : '×'}
                    </div>
                )}
            </div>
        );
    };

    const renderContentReview = () => {
        if (loading || !questions.length) {
            return <div className="subtitle">Loading questions...</div>;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

        return (
            <div className="retro-window">
                <div className="timer-bar">
                    <div 
                        className="timer-fill"
                        style={{width: `${progress}%`}}
                    />
                </div>

                <h3 className="subtitle">Question {currentQuestionIndex + 1}</h3>
                <p>{currentQuestion.question}</p>
                
                {!answered ? (
                    <button 
                        className="button"
                        onClick={() => setAnswered(true)}
                    >
                        Reveal Answer
                    </button>
                ) : (
                    <>
                        <div className="answer-reveal">
                            {currentQuestion.book}
                        </div>
                        <button 
                            className="button"
                            onClick={() => {
                                if (currentQuestionIndex < questions.length - 1) {
                                    setCurrentQuestionIndex(i => i + 1);
                                    setAnswered(false);
                                } else {
                                    setGameState('finished');
                                }
                            }}
                        >
                            Next Question
                        </button>
                    </>
                )}
            </div>
        );
    };

    const renderFinished = () => {
        const messages = {
            quiz: [
                { threshold: 90, text: "LEGENDARY! You're a reading warrior!" },
                { threshold: 70, text: "AWESOME JOB! You're on your way to becoming a master!" },
                { threshold: 50, text: "WELL DONE! Keep reading and practicing!" },
                { threshold: 0, text: "GOOD TRY! Every question makes you stronger!" }
            ],
            review: [
                "Great job reviewing the content!",
                "Keep reading and learning!",
                "You're becoming a better reader every day!"
            ]
        };

        let content;
        if (gameState === 'review') {
            const randomMessage = messages.review[Math.floor(Math.random() * messages.review.length)];
            content = (
                <>
                    <h2 className="title">{randomMessage}</h2>
                    <p className="subtitle">You've reviewed all the questions!</p>
                </>
            );
        } else {
            const percentage = (score / questionCount) * 100;
            const message = messages.quiz.find(m => percentage >= m.threshold).text;
            content = (
                <>
                    <h2 className="title">{message}</h2>
                    <p className="subtitle">Final Score: {score} / {questionCount}</p>
                </>
            );
        }

        return (
            <>
                {content}
                <div className="character-select">
                    <button className="button" onClick={() => setGameState('mode')}>
                        Try Another Challenge
                    </button>
                    <button className="button" onClick={() => setGameState('title')}>
                        Back to Start
                    </button>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch(gameState) {
            case 'title':
                return renderTitle();
            case 'team':
                return renderTeamSelect();
            case 'mode':
                return renderGameModeSelect();
            case 'playing':
                return renderPlaying();
            case 'review':
                return renderContentReview();
            case 'finished':
                return renderFinished();
            default:
                return renderTitle();
        }
    };

    return (
        <div className="container">
            {renderContent()}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));