import React from "react";
import HeroBanner from "./HeroBanner";
import Row from "./Row";
import ContinueWatchingRow from "./ContinueWatchingRow";
import useTrendingData from "../hooks/TrendingData";
import { useModal } from "../context/ModalContext";

// Genre List
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  // { id: 35, name: "Comedy" },
  // { id: 80, name: "Crime" },
  // { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  // { id: 10751, name: "Family" },
  // { id: 14, name: "Fantasy" },
  // { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  // { id: 10402, name: "Music" },
  // { id: 9648, name: "Mystery" },
  // { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  // { id: 10752, name: "War" },
  // { id: 37, name: "Western" },
];

export default function Home() {
  const { openModal } = useModal();

  // Fetch Trending Data for specific rows
  const { trendingData: trendingMovies } = useTrendingData("movie");
  const { trendingData: trendingTV } = useTrendingData("tv");

  // Static Data for Hero Banner (High Quality Backdrops)
  const heroData = [
    // {
    //   "backdrop_path": "/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg",
    //   "id": 1396,
    //   "name": "Breaking Bad",
    //   "original_name": "Breaking Bad",
    //   "overview": "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
    //   "poster_path": "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     18,
    //     80
    //   ],
    //   "popularity": 111.0165,
    //   "first_air_date": "2008-01-20",
    //   "vote_average": 8.926,
    //   "vote_count": 15575,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    // {
    //   "backdrop_path": "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    //   "id": 66732,
    //   "name": "Stranger Things",
    //   "original_name": "Stranger Things",
    //   "overview": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    //   "poster_path": "/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     18,
    //     10765,
    //     9648
    //   ],
    //   "popularity": 65.8567,
    //   "first_air_date": "2016-07-15",
    //   "vote_average": 8.596,
    //   "vote_count": 18321,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    // {
    //   "backdrop_path": "/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    //   "id": 60059,
    //   "name": "Better Call Saul",
    //   "original_name": "Better Call Saul",
    //   "overview": "Six years before Saul Goodman meets Walter White. We meet him when the man who will become Saul Goodman is known as Jimmy McGill, a small-time lawyer searching for his destiny, and, more immediately, hustling to make ends meet. Working alongside, and, often, against Jimmy, is “fixer” Mike Ehrmantraut. The series tracks Jimmy’s transformation into Saul Goodman, the man who puts “criminal” in “criminal lawyer\".",
    //   "poster_path": "/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     80,
    //     18
    //   ],
    //   "popularity": 66.9043,
    //   "first_air_date": "2015-02-08",
    //   "vote_average": 8.689,
    //   "vote_count": 5653,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    // {
    //   "backdrop_path": "/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
    //   "id": 1399,
    //   "name": "Game of Thrones",
    //   "original_name": "Game of Thrones",
    //   "overview": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
    //   "poster_path": "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     10765,
    //     18,
    //     10759
    //   ],
    //   "popularity": 193.4111,
    //   "first_air_date": "2011-04-17",
    //   "vote_average": 8.456,
    //   "vote_count": 25033,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    // {
    //   "backdrop_path": "/lHe8iwM4Cdm6RSEiara4PN8ZcBd.jpg",
    //   "id": 44217,
    //   "name": "Vikings",
    //   "original_name": "Vikings",
    //   "overview": "The adventures of Ragnar Lothbrok, the greatest hero of his age. The series tells the sagas of Ragnar's band of Viking brothers and his family, as he rises to become King of the Viking tribes. As well as being a fearless warrior, Ragnar embodies the Norse traditions of devotion to the gods. Legend has it that he was a direct descendant of Odin, the god of war and warriors.",
    //   "poster_path": "/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     10759,
    //     18,
    //     10768
    //   ],
    //   "popularity": 92.2886,
    //   "first_air_date": "2013-03-03",
    //   "vote_average": 8.095,
    //   "vote_count": 7182,
    //   "origin_country": [
    //     "CA"
    //   ]
    // },
    // {
    //   "backdrop_path": "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    //   "id": 94997,
    //   "name": "House of the Dragon",
    //   "original_name": "House of the Dragon",
    //   "overview": "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.",
    //   "poster_path": "/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     10765,
    //     18,
    //     10759
    //   ],
    //   "popularity": 65.6369,
    //   "first_air_date": "2022-08-21",
    //   "vote_average": 8.339,
    //   "vote_count": 5329,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    // {
    //   "backdrop_path": "/7w165QdHmJuTHSQwEyJDBDpuDT7.jpg",
    //   "id": 2288,
    //   "name": "Prison Break",
    //   "original_name": "Prison Break",
    //   "overview": "Due to a political conspiracy, an innocent man is sent to death row and his only hope is his brother, who makes it his mission to deliberately get himself sent to the same prison in order to break the both of them out, from the inside out.",
    //   "poster_path": "/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
    //   "media_type": "tv",
    //   "adult": false,
    //   "original_language": "en",
    //   "genre_ids": [
    //     10759,
    //     80,
    //     18
    //   ],
    //   "popularity": 117.1645,
    //   "first_air_date": "2005-08-29",
    //   "vote_average": 8.1,
    //   "vote_count": 5426,
    //   "origin_country": [
    //     "US"
    //   ]
    // },
    {
      "backdrop_path": "/siA2d4PNn4JVFZAwfIYx4pnKCaK.jpg",
      "id": 46648,
      "name": "True Detective",
      "original_name": "True Detective",
      "overview": "An American anthology police detective series utilizing multiple timelines in which investigations seem to unearth personal and professional secrets of those involved, both within or outside the law.",
      "poster_path": "/cuV2O5ZyDLHSOWzg3nLVljp1ubw.jpg",
      "media_type": "tv",
      "adult": false,
      "original_language": "en",
      "genre_ids": [
        18,
        9648
      ],
      "popularity": 43.3415,
      "first_air_date": "2014-01-12",
      "vote_average": 8.286,
      "vote_count": 3648,
      "origin_country": [
        "US"
      ]
    },
    {
      "backdrop_path": "/uJUe985oIuRiD3hmHQYskIMc2WU.jpg",
      "id": 62560,
      "name": "Mr. Robot",
      "original_name": "Mr. Robot",
      "overview": "A contemporary and culturally resonant drama about a young programmer, Elliot, who suffers from a debilitating anti-social disorder and decides that he can only connect to people by hacking them. He wields his skills as a weapon to protect the people that he cares about. Elliot will find himself in the intersection between a cybersecurity firm he works for and the underworld organizations that are recruiting him to bring down corporate America.",
      "poster_path": "/kv1nRqgebSsREnd7vdC2pSGjpLo.jpg",
      "media_type": "tv",
      "adult": false,
      "original_language": "en",
      "genre_ids": [
        80,
        18
      ],
      "popularity": 32.8335,
      "first_air_date": "2015-06-24",
      "vote_average": 8.249,
      "vote_count": 4841,
      "origin_country": [
        "US"
      ]
    },
    {
      "backdrop_path": "/qq36sU5xH581RiNEkookMQ9D7yp.jpg",
      "id": 194764,
      "name": "The Penguin",
      "original_name": "The Penguin",
      "overview": "With the city in peril following the seawall's collapse, Oswald \"Oz\" Cobb seeks to fill the power vacuum left by the death of Carmine Falcone and finally give his mother Francis the life he's always promised. But first, Oz must confront his enemies and his own demoralizing reputation as \"the Penguin.\"",
      "poster_path": "/vOWcqC4oDQws1doDWLO7d3dh5qc.jpg",
      "media_type": "tv",
      "adult": false,
      "original_language": "en",
      "genre_ids": [
        18,
        80
      ],
      "popularity": 18.1841,
      "first_air_date": "2024-09-19",
      "vote_average": 8.462,
      "vote_count": 949,
      "origin_country": [
        "US"
      ]
    },
    {
      "adult": false,
      "backdrop_path": "/plDp52MirFHc2PMJRMNWoG0kfr3.jpg",
      "genre_ids": [
        18,
        28,
        80,
        53
      ],
      "id": 155,
      "original_language": "en",
      "original_title": "The Dark Knight",
      "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
      "popularity": 30.3764,
      "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "release_date": "2008-07-16",
      "title": "The Dark Knight",
      "video": false,
      "vote_average": 8.52,
      "vote_count": 33871
    },
    {
      "adult": false,
      "backdrop_path": "/y2DB71C4nyIdMrANijz8mzvQtk6.jpg",
      "genre_ids": [
        28,
        80,
        18,
        53
      ],
      "id": 49026,
      "original_language": "en",
      "original_title": "The Dark Knight Rises",
      "overview": "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
      "popularity": 15.6467,
      "poster_path": "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
      "release_date": "2012-07-17",
      "title": "The Dark Knight Rises",
      "video": false,
      "vote_average": 7.785,
      "vote_count": 23224
    },
    {
      "adult": false,
      "backdrop_path": "/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
      "genre_ids": [
        80,
        9648,
        53
      ],
      "id": 414906,
      "original_language": "en",
      "original_title": "The Batman",
      "overview": "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      "popularity": 21.1679,
      "poster_path": "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      "release_date": "2022-03-01",
      "title": "The Batman",
      "video": false,
      "vote_average": 7.7,
      "vote_count": 10914
    },
    {
      "adult": false,
      "backdrop_path": "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      "genre_ids": [
        28,
        878,
        12
      ],
      "id": 27205,
      "original_language": "en",
      "original_title": "Inception",
      "overview": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
      "popularity": 28.2038,
      "poster_path": "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      "release_date": "2010-07-15",
      "title": "Inception",
      "video": false,
      "vote_average": 8.369,
      "vote_count": 37482
    },
    {
      "adult": false,
      "backdrop_path": "/rlay2M5QYvi6igbGcFjq8jxeusY.jpg",
      "genre_ids": [
        80,
        53,
        18
      ],
      "id": 475557,
      "original_language": "en",
      "original_title": "Joker",
      "overview": "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
      "popularity": 20.1781,
      "poster_path": "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      "release_date": "2019-10-01",
      "title": "Joker",
      "video": false,
      "vote_average": 8.137,
      "vote_count": 26459
    },
    {
      "adult": false,
      "backdrop_path": "/l33oR0mnvf20avWyIMxW02EtQxn.jpg",
      "genre_ids": [
        12,
        18,
        878
      ],
      "id": 157336,
      "original_language": "en",
      "original_title": "Interstellar",
      "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      "popularity": 38.2921,
      "poster_path": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      "release_date": "2014-11-05",
      "title": "Interstellar",
      "video": false,
      "vote_average": 8.454,
      "vote_count": 37174
    },
    {
      "adult": false,
      "backdrop_path": "/eD7FnB7LLrBV5ewjdGLYTAoV9Mv.jpg",
      "genre_ids": [
        28,
        53
      ],
      "id": 245891,
      "original_language": "en",
      "original_title": "John Wick",
      "overview": "Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.",
      "popularity": 14.2176,
      "poster_path": "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
      "release_date": "2014-10-22",
      "title": "John Wick",
      "video": false,
      "vote_average": 7.445,
      "vote_count": 19701,
      "media_type": "movie"
    },
    {
      "adult": false,
      "backdrop_path": "/dQOphbONxlpPsKo30araFr0CYMO.jpg",
      "genre_ids": [
        10765,
        18,
        10759
      ],
      "id": 71912,
      "origin_country": [
        "US"
      ],
      "original_language": "en",
      "original_name": "The Witcher",
      "overview": "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
      "popularity": 35.3546,
      "poster_path": "/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
      "first_air_date": "2019-12-20",
      "name": "The Witcher",
      "vote_average": 8.025,
      "vote_count": 6130,
      "media_type": "tv"
    },
    {
      "backdrop_path": "/2vxKa3gMHc84O1iHRkslqeHSsxE.jpg",
      "id": 1068452,
      "title": "Hi Nanna",
      "original_title": "హాయ్ నాన్న",
      "overview": "Six-year-old Mahi, a spirited child with cystic fibrosis, shares a deep yet complex bond with her father, Viraj, a dedicated single parent and successful fashion photographer. Her curiosity about her absent mother leads to a journey of discovery when she runs away with her loyal dog, Pluto. A chance encounter with a kind woman named Yashna sparks unexpected revelations, intertwining their lives in ways they never anticipated. Set against a backdrop of love, sacrifice, and redemption, Mahi’s story is a heartfelt exploration of family, resilience, and the enduring power of connection.",
      "poster_path": "/hhMLtq9m1aK0dpY9Wcq26XeDH2z.jpg",
      "media_type": "movie",
      "adult": false,
      "original_language": "te",
      "genre_ids": [
        18,
        10751,
        10749
      ],
      "popularity": 4.5737,
      "release_date": "2023-12-07",
      "video": false,
      "vote_average": 7.819,
      "vote_count": 47
    },
    {
      "backdrop_path": "/3Sdi32wfIIOtDz1hYik6bGe1iWC.jpg",
      "id": 634120,
      "title": "777 Charlie",
      "original_title": "777 ಚಾರ್ಲಿ",
      "overview": "Dharma is stuck in a rut with his negative and lonely lifestyle and spends each day in the comfort of his loneliness. A pup named Charlie who is naughty and energetic which is a complete contrast with the Dharma’s character enters his life and gives him a new perspective towards it.",
      "poster_path": "/qArPmXH0aWsT3SEtYl8XrU2Oz48.jpg",
      "media_type": "movie",
      "adult": false,
      "original_language": "kn",
      "genre_ids": [
        18,
        12,
        35
      ],
      "popularity": 2.5271,
      "release_date": "2022-06-10",
      "video": false,
      "vote_average": 7.6,
      "vote_count": 51
    },
    {
      "backdrop_path": "/rGkjtv6UdL1ysDmZuBjbNl3PAA1.jpg",
      "id": 132117,
      "name": "Farzi",
      "original_name": "फर्जी",
      "overview": "Sunny, a brilliant small-time artist is catapulted into the high-stakes world of counterfeiting when he creates the perfect fake currency note, even as Michael, a fiery, unorthodox task force officer wants to rid the country of the counterfeiting menace. In this thrilling cat-and-mouse race, losing is not an option!",
      "poster_path": "/cTS86RwEBIDgCgUmjWQTSoPsK6p.jpg",
      "media_type": "tv",
      "adult": false,
      "original_language": "hi",
      "genre_ids": [
        18,
        80
      ],
      "popularity": 13.7369,
      "first_air_date": "2023-02-10",
      "vote_average": 7.806,
      "vote_count": 126,
      "origin_country": [
        "IN"
      ]
    },
    {
      "backdrop_path": "/nGlNQ6uiS63g8MTAbPrhvmCIFO3.jpg",
      "id": 824744,
      "title": "Shiddat",
      "original_title": "शिद्दत",
      "overview": "Love-struck Jaggi can cross the seven seas for his dream girl, Kartika. Even if it means stopping her wedding as he doesn't want to be friend-zoned.",
      "poster_path": "/7OMGLNH4yv4UxLI9gmKZSjY6enS.jpg",
      "media_type": "movie",
      "adult": false,
      "original_language": "hi",
      "genre_ids": [
        10749,
        18
      ],
      "popularity": 2.8112,
      "release_date": "2021-10-01",
      "video": false,
      "vote_average": 6.8,
      "vote_count": 23
    }
  ]

  return (
    <div className="bg-[#0f1014] min-h-screen text-white pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="mb-12">
        <HeroBanner
          movies={heroData}
          onMoreInfoClick={openModal}
        />
      </div>

      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Continue Watching */}
        <ContinueWatchingRow />

        {/* Trending Rows */}
        <Row title="Trending Movies" movies={trendingMovies} mediaType="movie" />
        <Row title="Trending TV Shows" movies={trendingTV} mediaType="tv" />

        {/* Genre Rows */}
        {GENRES.map((genre) => (
          <Row
            key={genre.id}
            title={genre.name}
            genreId={genre.id}
          />
        ))}
      </div>
    </div>
  );
}