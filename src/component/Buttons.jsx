export function RollDice(props) {
  return (
    <button onClick={props.rollDice} className='bg-[#5035FF] text-white font-bold w-[5.76rem] min-w-max h-[2.24rem] px-3 capitalize rounded active:scale-95 transition-all text-[16.38px] drop-shadow-lg'>roll</button>
  )
}

export function NewGame(props) {
  return (
    <button onClick={props.newGame} className='bg-[#5035FF] text-white font-bold w-[5.76rem] min-w-max h-[2.24rem] px-3 capitalize rounded active:scale-95 transition-all text-[16.38px] drop-shadow-lg'>new game</button>
  )
}