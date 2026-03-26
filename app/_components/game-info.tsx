type GameInfoProps = {
  firstReleaseDate: string
  platform: string
  developers: string
  region: string
}

export function GameInfo(props: GameInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-red-500 font-bold text-xl">{props.platform}</p>
      <div className="flex gap-4">
        <p className="font-bold w-28">Developed by</p>
        <p>{props.developers}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-28">Year</p>
        <p>{props.firstReleaseDate}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-28">Condition</p>
        <p>CIB</p>
      </div>
    </div>
  )
}
