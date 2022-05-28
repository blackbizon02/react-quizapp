import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import './App.css';
import Question from './Question';

function App() {
  let score = 0;
  const [quiz, setQuiz] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [checkAnswers, setCheckAnswers] = useState(false)
  const [resetQuiz, setResetQuiz] = useState(0)
  const [isloading, setIsLoading] = useState(true)

  if (showAnswers) {
    quizData.map(questions => {
      return questions.allAnswers.forEach(answer => {
        return answer.isHeld && answer.isCorrect ? score++ : score;
      })
    })
  }

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then(res => res.json())
      .then(data => {
        setQuizData(() => {
          return data.results.map(question => {
            const incorrect = question.incorrect_answers.map(answer => {
              return { id: nanoid(), value: answer, isHeld: false, isCorrect: false }
            })

            const correct = { id: nanoid(), value: question.correct_answer, isHeld: false, isCorrect: true }

            const allAnswers = [...incorrect]
            const random = Math.floor(Math.random() * 4)
            allAnswers.splice(random, 0, correct)


            return { ...question, allAnswers: allAnswers, id: nanoid() }
          })
        })
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false))
  }, [resetQuiz])

  console.log(quizData[0])



  function start() {
    setQuiz(true)
  }

  function updateHeld(quesID, ansID) {
    return setQuizData(prevQuizData => {
      return prevQuizData.map(question => {
        if (question.id !== quesID) {
          return question
        } else {
          const newAnswers = question.allAnswers.map(answer => {
            if (!answer.isHeld) {
              return answer.id === ansID
                ? { ...answer, isHeld: !answer.isHeld }
                : answer
            } else {
              return answer.id !== ansID
                ? { ...answer, isHeld: false }
                : { ...answer, isHeld: !answer.isHeld }
            }
          })

          return { ...question, allAnswers: newAnswers }
        }
      })
    })
  }

  function showAnswers() {
    setCheckAnswers(true)
  }

  function reset() {
    setResetQuiz(prev => prev + 1)
    setCheckAnswers(false)
  }


  const questionElements = quizData.map((question) => (
    <Question
      key={question.id}
      question={question.question}
      answers={question.allAnswers}
      id={question.id}
      updateHeld={updateHeld}
      showAnswers={checkAnswers}
    />
  ))

  const buttonElement = () => {
    return (
      !checkAnswers
        ?
        <button className='submit' onClick={showAnswers}>Check answers</button>
        :
        <div className='footer'>
          <p className='quiz__finalText'>{`You scored ${score}/5 answers`}</p>
          <button className='submit' onClick={reset}>Play Again</button>
        </div>
    )
  }




  return (
    <main className='container'>
      {
        quiz ?
          isloading
            ?
            <div className='quiz__loading--box'>
              <h3 className='quiz__loading--text'>One moment please...</h3>
            </div>
            :
            <div className='main-content'>
              {questionElements}
              {buttonElement()}
            </div>
          :
          <div className='start-quiz'>
            <h1>Quizzical</h1>
            <p>Some description if needed</p>
            <button onClick={start}>Start quiz</button>
          </div>
      }
    </main>
  );
}

export default App;
