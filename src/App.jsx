import { useState, useEffect, useRef } from 'react'
import Die from './component/Die'
import Confetti from 'react-confetti'
import { nanoid } from 'nanoid'

function App() {

  function getLocalStorage() {
    return localStorage.getItem('best-time') ?
      JSON.parse(localStorage.getItem('best-time')) :
      []
  }
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [time, setTime] = useState(0)
  const [start, setStart] = useState(false)
  const [bestTime, setBestTime] = useState(getLocalStorage)
  //const [btnEnabled, setBtnEnabled] = useState(false)

  useEffect(() => {
    let interval = null
    if (start) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }
    if (tenzies) {
      setStart(false)
      localStorage.setItem('best-time', JSON.stringify(bestTime))
      saveBestTime()
    }

    return () => clearInterval(interval)
  }, [start, tenzies])

  const startGame = () => {
    setStart(true)
    //setBtnEnabled(true)
    /* add disabled button */
  }

  const date = {
    minutes: ('0' + Math.floor((time / 60000) % 60)).slice(-2),
    seconds: ('0' + Math.floor((time / 1000) % 60)).slice(-2)
  }

  function saveBestTime() {
    setBestTime(prevTime => {
      return {
        ...prevTime,
        minutes: date.minutes > bestTime.minutes ? bestTime.minutes : date.minutes,
        seconds: date.seconds > bestTime.seconds ? bestTime.seconds : date.seconds
      }
    })
  }

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const AllSameValue = dice.every(die => die.value === firstValue)

    if (allHeld && AllSameValue) {
      setTenzies(true)
    }
  }, [dice])

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id
          ? { ...die, isHeld: !die.isHeld }
          : die
      })
    )
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  const incrementRollCount = () => setRollCount(prevCount => prevCount + 1)

  const resetRollCount = () => setRollCount(0)

  const resetTime = () => setTime(0)

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice =>
        oldDice.map(die => {
          return die.isHeld ?
            die :
            generateNewDie()
        }))
      incrementRollCount()
    } else {
      setTenzies(false)
      setDice(allNewDice())
      resetTime()
      resetRollCount()
    }
  }

  const dieElements = dice.map(die => (
    <Die
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      value={die.value}
    />
  ))

  return (
    <main className=' w-[20rem] min-h-[20rem] bg-[#F5F5F5] rounded-lg px-4 py-8 flex flex-col items-center justify-around'>
      {tenzies && <Confetti />}
      <h4 className='font-bold text-[1.3rem] text-[#2B283A]'></h4>
      <h2 className="absolute flex text-2xl top-2 left-2 font-bold text-white">Rolls: {rollCount}</h2>
      <h1 className="absolute flex text-lg top-12 left-2 font-bold text-white">
        Best Time: {bestTime.minutes}:{bestTime.seconds}
      </h1>
      <button
        onClick={startGame}
        className='absolute top-2 right-2 bg-[#5035FF] text-white font-bold min-w-max h-[2.24rem] px-3 capitalize rounded active:scale-95 transition-all text-[16.38px] drop-shadow-l'
      >
        <i className="fa-solid fa-play"></i>
      </button>
      <h1 className="absolute flex text-2xl top-2 font-bold text-white">
        <span>{date.minutes}</span>:
        <span>{date.seconds}</span>
      </h1>
      <h1 className="font-bold text-[1.6rem] capitalize">tenzies</h1>
      <p className="font-normal text-[#4A4E74] text-[13.11px] w-[15.56rem] text-center mb-5">
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <section className="w-full grid grid-cols-5 grid-rows-2 gap-y-5 place-items-center mb-8">
        {dieElements}
      </section>
      <button onClick={rollDice} className='bg-[#5035FF] text-white font-bold w-[5.76rem] min-w-max h-[2.24rem] px-3 capitalize rounded active:scale-95 transition-all text-[16.38px] drop-shadow-lg'>{tenzies ? 'new game' : 'roll'}</button>
    </main>
  )
}

export default App
