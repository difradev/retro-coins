type GameInfoProps = {
  platform: string
  region: string
  condition: string
  release: number
}

export function GameInfo(props: GameInfoProps) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex gap-4 w-full">
        <p className="font-bold w-16">Platform</p>
        <p className="">{props.platform}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-16">Region</p>
        <p className="">{props.region}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-16">Condition</p>
        <p>{props.condition}</p>
      </div>
      <div className="flex gap-4">
        <p className="font-bold w-16">Release</p>
        <p>{props.release}</p>
      </div>
    </div>
  )
}
