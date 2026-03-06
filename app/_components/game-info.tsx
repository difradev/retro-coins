type GameInfoProps = {
  platform: string
  region: string
  condition: string
}

export function GameInfo(props: GameInfoProps) {
  return (
    <div className="flex gap-1.5 items-start">
      <p className="text-xl font-bold text-white bg-linear-to-r from-red-500 to-red-600 p-2 rounded-sm">
        {props.platform}
      </p>
      <p className="text-xl font-bold text-white bg-linear-to-r from-red-500 to-red-600 p-2 rounded-sm">
        {props.region}
      </p>
      <p className="text-xl font-bold text-white bg-linear-to-r from-red-500 to-red-600 p-2 rounded-sm">
        {props.condition}
      </p>
    </div>
  )
}
