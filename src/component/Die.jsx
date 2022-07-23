export default function Die(props) {
  const bg = {
    backgroundColor: props.isHeld ? '#59E391' : '#fff'
  }
  return (
    <div
      onClick={props.holdDice}
      style={bg}
      className="h-[2.24rem] w-[2.24rem] rounded drop-shadow grid place-items-center cursor-pointer select-none transition-colors"
    >
      <h2 className="font-bold text-[1.3rem] text-[#2B283A]">{props.value}</h2>
    </div>
  )
}