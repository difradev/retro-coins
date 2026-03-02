'use client'

type ChipProps = {
  label: string
}

export default function Chip({ label }: ChipProps): React.ReactNode {
  return (
    <div className="p-2 border border-gray-400 bg-white w-auto text-gray-800 font-bold rounded-md hover:cursor-pointer hover:opacity-70">
      <p>{label}</p>
    </div>
  )
}
