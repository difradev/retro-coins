import { comments, db } from "@/lib/database";
import Searchbar from "./components/Searchbar";

export default async function Home() {
  const allComments = await db.select().from(comments);
  console.log(allComments);
  return (
    <div>
      <main>
        <p>Homepage!</p>
        <Searchbar />
      </main>
    </div>
  );
}
