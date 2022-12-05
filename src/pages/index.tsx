import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [randomSong, setRandomSong] = useState("");

  const searchSongs = trpc.song.getByTitleOrArtist.useQuery({
    search: searchInput,
  });
  const { data: randomData, refetch: refetchRandom } =
    trpc.song.getRandom.useQuery(undefined, {
      enabled: false,
    });

  return (
    <>
      <form>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-md border border-gray-800 p-2"
        />
      </form>
      <div className="m-2 border border-gray-800 p-3">
        {searchSongs.data
          ? searchSongs.data.map((song) => (
              <div key={song.id}>
                {song.title} - {song.artist}
              </div>
            ))
          : null}
      </div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => {
          //
        }}
      >
        random
      </button>
      {JSON.stringify(randomSong, null, 2)}
    </>
  );
}
