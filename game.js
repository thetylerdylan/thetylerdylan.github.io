const TEAM_MEMBERS = {
    'Wise Eyes': ['Aesop', 'Lara', 'Ronan', 'Quincy'],
    'BOBOs': ['Archer', 'Matthew', 'Jordynn', 'Seth', 'Matilda']
};

const App = () => {
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

    React.useEffect(() => {
        if (gameState === 'playing' || gameState === 'review') {
            loadQuestions();
        }
    }, [gameState, questionCount]);

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
            
            // Filter based on game mode
            const filteredQuestions = parsedData.data.filter(q => 
                gameState === 'playing' ? q.qtype === 'iwb' : q.qtype === 'con'
            );

            const shuffledQuestions = filteredQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, questionCount);
            
            if (gameState === 'playing') {
                // Pre-calculate answer options for each question
                const questionsWithOptions = shuffledQuestions.map(question => {
                    const otherBooks = new Set(parsedData.data.map(q => q.book));
                    otherBooks.delete(question.book);
                    const optionsArray = Array.from(otherBooks);
                    const randomOptions = [];
                    
                    while (randomOptions.length < 3) {
                        const randomIndex = Math.floor(Math.random() * optionsArray.length);
                        const option = optionsArray.splice(randomIndex, 1)[0];
                        randomOptions.push(option);
                    }
                    
                    return {
                        ...question,
                        question: question.question.replace('iwb', 'In Which Book'),
                        options: [...randomOptions, question.book].sort(() => Math.random() - 0.5)
                    };
                });
                setQuestions(questionsWithOptions);
            } else {
                setQuestions(shuffledQuestions);
            }
            
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

    const renderProgress = () => (
        <div className="question-progress">
            {questions.map((_, index) => (
                <div
                    key={index}
                    className={`progress-segment ${
                        index < currentQuestionIndex 
                            ? answersHistory[index] 
                                ? 'correct' 
                                : 'incorrect'
                            : index === currentQuestionIndex 
                                ? 'current' 
                                : ''
                    }`}
                />
            ))}
        </div>
    );

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

    const resetGameState = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(30);
        setAnswered(false);
        setAnswersHistory([]);
        setShowFeedback(false);
        setLastAnswerCorrect(false);
        setLoading(false);
    };

    const startNewGame = (count, mode) => {
        resetGameState();
        setQuestionCount(count);
        setGameState(mode);
    };

    const renderGameModeSelect = () => (
        <>
            <h2 className="subtitle">CHOOSE YOUR CHALLENGE</h2>
            
            <div className="retro-window">
                <h3 className="subtitle">In Which Book Challenge</h3>
                <div className="character-select">
                    <button 
                        className="button"
                        onClick={() => startNewGame(10, 'playing')}
                    >
                        10 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => startNewGame(20, 'playing')}
                    >
                        20 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => startNewGame(30, 'playing')}
                    >
                        30 Questions
                    </button>
                </div>
            </div>

            <div className="retro-window">
                <h3 className="subtitle">Content Review</h3>
                <p className="review-text">Practice with questions at your own pace.</p>
                <div className="character-select">
                    <button 
                        className="button"
                        onClick={() => startNewGame(5, 'review')}
                    >
                        5 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => startNewGame(10, 'review')}
                    >
                        10 Questions
                    </button>
                    <button 
                        className="button"
                        onClick={() => startNewGame(20, 'review')}
                    >
                        20 Questions
                    </button>
                </div>
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
                
                {renderProgress()}

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
                    <div className="feedback-overlay">
                        <div className="feedback-content">
                            {lastAnswerCorrect ? '✓' : '×'}
                        </div>
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

        return (
            <div className="retro-window">

                <h3 className="subtitle">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <p>{currentQuestion.question}</p>
                
                {!answered ? (
                    <div className="center-button">
                        <button 
                            className="button"
                            onClick={() => setAnswered(true)}
                        >
                            Reveal Answer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="answer-text">
                            {currentQuestion.answer}
                        </div>
                        <div className="center-button">
                            <button 
                                className="button"
                                onClick={() => {
                                    if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex(i => i + 1);
                                        setAnswered(false);
                                    } else {
                                        setGameState('reviewComplete');  // Changed to a distinct state
                                    }
                                }}
                            >
                                Next Question
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderReviewComplete = () => {
        const messages = [
            "Great job reviewing the content!",
            "Keep reading and learning!",
            "You're becoming a better reader every day!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return (
            <>
                <h2 className="title">{randomMessage}</h2>
                <div className="character-select">
                    <button 
                        className="button" 
                        onClick={() => {
                            resetGameState();
                            setGameState('mode');
                        }}
                    >
                        Try Another Challenge
                    </button>
                    <button 
                        className="button" 
                        onClick={() => {
                            resetGameState();
                            setGameState('title');
                        }}
                    >
                        Back to Start
                    </button>
                </div>
            </>
        );
    };
    
    const renderFinished = () => {
        if (gameState === 'finished') {
            const messages = [
                "Great job reviewing the content!",
                "Keep reading and learning!",
                "You're becoming a better reader every day!"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            return (
                <>
                    <h2 className="title">{randomMessage}</h2>
                    <div className="character-select">
                        <button 
                            className="button" 
                            onClick={() => {
                                resetGameState();
                                setGameState('mode');
                            }}
                        >
                            Try Another Challenge
                        </button>
                        <button 
                            className="button" 
                            onClick={() => {
                                resetGameState();
                                setGameState('title');
                            }}
                        >
                            Back to Start
                        </button>
                    </div>
                </>
            );
        }
    
        // Only show scoring for the quiz mode
        const percentage = (score / questionCount) * 100;
        let message = '';
        if (percentage >= 90) message = "LEGENDARY! You're a reading warrior!";
        else if (percentage >= 70) message = "AWESOME JOB! You're on your way to becoming a master!";
        else if (percentage >= 50) message = "WELL DONE! Keep reading and practicing!";
        else message = "GOOD TRY! Every question makes you stronger!";
    
        return (
            <>
                <h2 className="title">{message}</h2>
                <p className="subtitle">Final Score: {score} / {questionCount}</p>
                <div className="character-select">
                    <button 
                        className="button" 
                        onClick={() => {
                            resetGameState();
                            setGameState('mode');
                        }}
                    >
                        Try Another Challenge
                    </button>
                    <button 
                        className="button" 
                        onClick={() => {
                            resetGameState();
                            setGameState('title');
                        }}
                    >
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
            case 'reviewComplete':  // Add new case
                return renderReviewComplete();
            default:
                return renderTitle();
        }
    };

    return (
        <div className="container">
            {renderContent()}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));