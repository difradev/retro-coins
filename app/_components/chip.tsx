'use client'

type ChipProps = {
  label: string
  selected: boolean
  onClick: () => void
}

export default function Chip({
  label,
  selected,
  onClick,
}: ChipProps): React.ReactNode {
  return (
    <div
      onClick={onClick}
      className={`p-2 border w-auto font-bold rounded-md hover:cursor-pointer transition-all ${
        selected
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-400 bg-white text-gray-800 hover:opacity-70'
      }`}
    >
      <p>{label}</p>
    </div>
  )
}
