import React from "react";
import TVData from "../hooks/TVData";
import HeroBanner from "./HeroBanner";
import ContinueWatchingRow from "./ContinueWatchingRow";
import Row from "./Row";
import CardSkeleton from "./CardSkeleton";
import { useModal } from "../context/ModalContext";

// TV Show Genre IDs from TMDB
const TV_GENRES = [
  { id: 18, name: "Drama Series" },
  { id: 35, name: "Comedy Shows" },
  { id: 10759, name: "Action & Adventure" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 80, name: "Crime" },
  { id: 9648, name: "Mystery" },
];

// Hero Banner Data for TV Shows
const tvHeroData = [
  {
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster_path: "/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    id: 66732,
    name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    vote_average: 8.6,
    first_air_date: "2016-07-15",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg",
    poster_path: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    id: 1396,
    name: "Breaking Bad",
    overview: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
    vote_average: 8.9,
    first_air_date: "2008-01-20",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    poster_path: "/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg",
    id: 94997,
    name: "House of the Dragon",
    overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne.",
    vote_average: 8.4,
    first_air_date: "2022-08-21",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    id: 100088,
    name: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the U.S. and depend on each other for survival.",
    vote_average: 8.6,
    first_air_date: "2023-01-15",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
    poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    id: 1399,
    name: "Game of Thrones",
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
    vote_average: 8.4,
    first_air_date: "2011-04-17",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    poster_path: "/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg",
    id: 60059,
    name: "Better Call Saul",
    overview: "Six years before Saul Goodman meets Walter White. We meet him when the man who will become Saul Goodman is known as Jimmy McGill, a small-time lawyer searching for his destiny, and, more immediately, parsing his conscience.",
    vote_average: 8.5,
    first_air_date: "2015-02-08",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/lHe8iwM4Cdm6RSEiara4PN8ZcBd.jpg",
    poster_path: "/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg",
    id: 44217,
    name: "Vikings",
    overview: "The adventures of Ragnar Lothbrok, the greatest hero of his age. The series tells the sagas of Ragnar's band of Viking brothers and his family, as he rises to become King of the Viking tribes.",
    vote_average: 8.0,
    first_air_date: "2013-03-03",
    media_type: "tv",
    original_language: "en"
  },
  {
    backdrop_path: "/7w165QdHmJuTHSQwEyJDBDpuDT7.jpg",
    poster_path: "/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
    id: 2288,
    name: "Prison Break",
    overview: "Due to a political conspiracy, an innocent man is sent to death row and his only hope is his brother, who makes it his mission to deliberately get himself sent to the same prison in order to break the both of them out, from the inside.",
    vote_average: 8.1,
    first_air_date: "2005-08-29",
    media_type: "tv",
    original_language: "en"
  },
];

export default function TVShows() {
  const { data: trendingTV, loading, error } = TVData();
  const { openModal } = useModal();

  if (loading) {
    return (
      <div className="bg-[#0f1014] min-h-screen pt-24 px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0f1014]">
        <p className='text-center text-xl font-bold text-red-400'>Error: {error.message}</p>
      </div>
    );
  }

  // Sort trending by rating for "Top Rated" row
  const topRatedTV = trendingTV ? [...trendingTV].sort((a, b) => b.vote_average - a.vote_average) : [];

  return (
    <div className="bg-[#0f1014] min-h-screen text-white pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="mb-12">
        <HeroBanner
          movies={tvHeroData}
          onMoreInfoClick={openModal}
        />
      </div>

      <div className="max-w-[1800px] mx-auto space-y-8 px-6">
        {/* Continue Watching */}
        <ContinueWatchingRow />

        {/* Popular TV Shows (Trending) */}
        <Row title="Popular TV Shows" movies={trendingTV} mediaType="tv" />

        {/* Top Rated Series */}
        <Row title="Top Rated Series" movies={topRatedTV} mediaType="tv" />

        {/* New & Trending - same data but could be filtered by date */}
        <Row title="New & Trending" movies={trendingTV?.slice(0, 15)} mediaType="tv" />

        {/* Genre Rows */}
        {TV_GENRES.slice(0, 3).map((genre) => (
          <Row
            key={genre.id}
            title={genre.name}
            genreId={genre.id}
            mediaType="tv"
          />
        ))}
      </div>
    </div>
  );
}
