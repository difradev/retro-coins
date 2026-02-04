import Header from './components/header'
import Searchbar from './components/searchbar'

export default async function Home() {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="flex justify-center items-center h-full w-full">
        <Searchbar />
      </div>
    </main>
  )
}
