type GameInfoProps = {
  region: string
  condition: string
  release: number
}

export function GameInfo(props: GameInfoProps) {
  return (
    <div className="flex flex-col gap-1 border-2 border-dotted p-2">
      <div className="flex gap-4">
        <p className="font-bold w-22">Region</p>
        <p className="">{props.region}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-22">Condition</p>
        <p>{props.condition}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-22">Year</p>
        <p>{props.release}</p>
      </div>
    </div>
  )
}
