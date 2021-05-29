import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Image, Text, Heading } from "@chakra-ui/react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import axios from "axios";
import {
  FaPlay,
  FaPause,
  FaCaretLeft,
  FaCaretRight,
  FaVolumeUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

//Example Data
const tracks = [
  {
    song_src: "1",
    title: "Hope",
    artist: "Benny Blaco",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://via.placeholder.com/200/0000FF",
    color: "#3b609c",
  },
  {
    song_src: "2",
    title: "Today",
    artist: "Justin Beiber",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
  {
    song_src: "3",
    title: "Dance",
    artist: "The ChainSmokers",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
  {
    song_src: "4",
    title: "Memories",
    artist: "Maroon 5",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
  {
    song_src: "4",
    title: "Memories",
    artist: "Maroon 5",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
  {
    song_src: "4",
    title: "Memories",
    artist: "Maroon 5",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
  {
    song_src: "4",
    title: "Memories",
    artist: "Maroon 5",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    image: "https://via.placeholder.com/200",
    color: "#3b609c",
  },
];

const MotionBox = motion(Box);

function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedTime, setClickedTime] = useState();
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [Dragbg, setDragbg] = useState(100);
  // const [xState, setXState] = useState(0);
  const accountReduxState = useSelector((state) => {
    return state?.account || "";
  });

  const x = useMotionValue(0);

  // Destructure for conciseness
  const { title, artist, color, image, audioSrc, song_src } =
    tracks[trackIndex];

  const initialValues = {
    song_src: 0,
    duration: 0,
    user_publickey: accountReduxState || 0,
  };

  function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  const [data, setData] = useState(initialValues);

  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration, currentTime, ended, volume } = audioRef.current;

  // const curPercentage = (currentTime / duration) * 100;

  useEffect(() => {
    console.log(currentTime, duration);
    if (isNaN(currentTime) || isNaN(duration)) return;
    const curPercentage = (currentTime / duration) * 100;
    console.log("current percentage", curPercentage);
    const scaleRes = scale(curPercentage, 0, 100, 0, 800);
    console.log("scale res", scaleRes);
    // setXState(scaleRes);
    x.set(scaleRes);
    console.log("THis is the get method below");
    x.get();
  }, [currentTime, duration]);

  const sendData = (values) => {
    axios.post("http://localhost:5000/api/reports", values).then((res) => {
      console.log(res.data);
    });
  };

  function formatDuration(duration) {
    return moment
      .duration(duration, "seconds")
      .format("mm:ss", { trim: false });
  }

  const cur = formatDuration(currentTime);

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        onNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
        setData({ ...data, duration: audioRef.current.currentTime });
      }
    }, [1000]);
  };

  const onPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const onNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  const dur = formatDuration(duration);

  useEffect(() => {
    console.log("acct state", accountReduxState);
    if (isPlaying) {
      audioRef.current.play();
      audioRef.current.volume = 1;
    } else {
      audioRef.current.pause();
      console.log("Paused Now Data will be Send");
      sendData({
        song_src: song_src,
        duration: currentTime,
        user_publickey: accountReduxState,
      });
    }
  }, [isPlaying]);

  const handleVol = (e) => {
    e.preventDefault();
    setMusicVolume((prev) => prev + 0.2);
    audioRef.current.volume(musicVolume);
  };

  const handleDrag = (e, i) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
      setDragbg(0);
    };
  }, []);

  //Handle setup when changing Tracks
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);
    if (clickedTime && clickedTime !== trackProgress) {
      audioRef.current.currentTime = clickedTime;
      setClickedTime(null);
    }

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  return (
    <Box
      opacity={0.7}
      pos="absolute"
      bottom="0"
      left="0"
      w="100vw"
      h="10vh"
      bg="gray.800"
      d="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2.5}
    >
      <Box color="blackAlpha.900" zIndex="1" d="flex" flexDir="row">
        <Image
          opacity={1}
          zIndex={100}
          boxSize="50px"
          objectFit="cover"
          borderRadius="full"
          src="https://placeimg.com/50/50/people"
          alt={`${title} from ${artist}`}
          ml={1}
        />
        <Box ml={4} color="white">
          <Heading size="sm" fontWeight="bold">
            {title}
          </Heading>
          <Text fontSize="md" fontWeight="thin">
            {artist}
          </Text>
        </Box>
      </Box>
      <Box>
        <Button
          size="lg"
          variant="ghost"
          type="button"
          color="white"
          aria-label="Previous"
          onClick={onPrevTrack}
          mr={2}
        >
          <FaCaretLeft />
        </Button>
        {isPlaying ? (
          <Button
            size="lg"
            variant="ghost"
            type="button"
            aria-label="Previous"
            color="white"
            onClick={() => setIsPlaying(false)}
          >
            <FaPause />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            variant="ghost"
            color="white"
            onClick={() => setIsPlaying(true)}
            aria-label="Play"
          >
            <FaPlay />
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          variant="ghost"
          aria-label="Next"
          onClick={onNextTrack}
          color="white"
          ml={2}
        >
          <FaCaretRight />
        </Button>
      </Box>
      <MotionBox d="flex" alignItems="center" bg="gray.500" h="0.5" w="800px">
        <MotionBox
          style={{ x }}
          w="1rem"
          h="1rem"
          bg="pink.500"
          borderRadius="full"
          whileHover={{ scale: 1.1 }}
          drag="x"
          dragConstraints={{ left: 0, right: 800 }}
          dragElastic={false}
          dragMomentum={false}
          onDrag={handleDrag}
        ></MotionBox>
      </MotionBox>
      <Box color="white">{dur}</Box>
      <Box
        mr={4}
        color="white"
        onClick={handleVol}
        _hover={{ color: "pink.500" }}
      >
        <FaVolumeUp />
      </Box>
    </Box>
  );
}

export default MusicPlayer;
