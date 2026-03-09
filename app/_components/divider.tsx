type DividerProps = {
  hight: string
}

export function Divider(props: DividerProps) {
  return <div className={`${props.hight} bg-blue-950 my-2 w-full`}></div>
}
