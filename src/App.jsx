import { useState, useEffect, useRef } from 'react'
import Die from './component/Die'
import Confetti from 'react-confetti'
import { nanoid } from 'nanoid'
import { RollDice, NewGame } from './component/Buttons'

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

  const newGame = () => {
    setTenzies(false)
    setDice(allNewDice())
    resetTime()
    resetRollCount()
    setStart(true)
  }

  function rollDice() {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    incrementRollCount()
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
        Best Time: {!bestTime.minutes ? '00' : bestTime.minutes}:{!bestTime.seconds ? '00' : bestTime.seconds}
      </h1>
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
      {!start ? <NewGame newGame={newGame} /> : <RollDice rollDice={rollDice} />}
    </main>
  )
}

export default App
