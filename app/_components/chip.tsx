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
      className={`p-2 border w-auto rounded-sm hover:cursor-pointer transition-all ${
        selected
          ? 'border-[#2247b5] bg-[#2247b5] text-white'
          : 'border-[#2247b5] bg-white text-[#2247b5]'
      }`}
    >
      <p>{label}</p>
    </div>
  )
}
