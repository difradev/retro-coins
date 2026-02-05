import { searchSuggestions } from './actions/search-suggestions'
import Header from './components/header'
import Searchbar from './components/searchbar'

export default function Home() {
  return (
    <main className="w-full h-full">
      <Header />
      <form
        action={searchSuggestions}
        className="w-full flex justify-center items-center h-full"
      >
        <Searchbar />
      </form>
    </main>
  )
}
