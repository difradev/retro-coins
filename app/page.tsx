import Header from './components/header'
import Searchbar from './components/searchbar'

export default function Home() {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full flex justify-center items-center h-full">
        <Searchbar />
      </div>
    </main>
  )
}
