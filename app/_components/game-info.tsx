type GameInfoProps = {
  firstReleaseDate: string
  platform: string
  developers: string
  region: string
}

export function GameInfo(props: GameInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-red-500 font-bold text-2xl mb-4">{props.platform}</p>
      <div className="flex gap-4">
        <p className="font-bold w-38">Developed by</p>
        <p>{props.developers}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-38">First release date</p>
        <p>{props.firstReleaseDate}</p>
      </div>
    </div>
  )
}
