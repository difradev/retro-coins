export default async function Games({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  console.log(id)
  return (
    <div>
      <main>
        <p>Games page!</p>
      </main>
    </div>
  )
}
