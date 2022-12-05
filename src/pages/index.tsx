import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");

  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");

  const { data: songList, refetch: refetchSongList } =
    trpc.song.getByTitleOrArtist.useQuery(
      {
        search: searchInput,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
  const { data: allSongs, refetch: refetchAllSongs } =
    trpc.song.getAllSongs.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  const { data: randomSong, refetch: refetchRandom } =
    trpc.song.getRandom.useQuery(undefined, {
      enabled: false,
    });
  const { mutateAsync: addSong } = trpc.song.addSong.useMutation();
  const { mutateAsync: deleteSong } = trpc.song.deleteSong.useMutation();

  return (
    <>
      <form>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value.trim())}
          className="rounded-md border border-gray-800 p-2"
          placeholder="search title or artist"
          type="search"
        />
      </form>
      <div className="m-2 border border-gray-800 p-3">
        {songList
          ? songList.map((song) => (
              <div key={song.id}>
                {song.title} - {song.artist}
              </div>
            ))
          : null}
        {songList && !songList.length
          ? `No results found for '${searchInput}'`
          : null}
      </div>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          refetchRandom();
        }}
      >
        random
      </button>
      {randomSong ? `${randomSong.artist} - ${randomSong.title}` : null}
      <div className="m-2 bg-blue-200 p-2">
        <div className="font-bold text-indigo-800">admin panel</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("submitting", newSongArtist, newSongTitle);
            const res = await addSong({
              title: newSongTitle,
              artist: newSongArtist,
            });
            if (res.id) {
              setNewSongTitle("");
              setNewSongArtist("");
            }
          }}
        >
          <input
            value={newSongTitle}
            onChange={(e) => setNewSongTitle(e.target.value)}
            className="rounded-md border border-gray-800 p-2"
            placeholder="title"
          />
          <input
            value={newSongArtist}
            onChange={(e) => setNewSongArtist(e.target.value)}
            className="rounded-md border border-gray-800 p-2"
            placeholder="artist"
          />
          <button
            type="submit"
            className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            add
          </button>
        </form>
        {allSongs
          ? allSongs.map((song) => (
              <div key={song.id}>
                {song.title} - {song.artist}
                <button
                  className="ml-1 hover:bg-red-500"
                  onClick={async () => {
                    await deleteSong({ id: song.id });
                    refetchAllSongs();
                    refetchSongList();
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          : null}
      </div>
    </>
  );
}

function TrashIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
        fill="currentColor"
      />
      <path d="M9 9H11V17H9V9Z" fill="currentColor" />
      <path d="M13 9H15V17H13V9Z" fill="currentColor" />
    </svg>
  );
}
