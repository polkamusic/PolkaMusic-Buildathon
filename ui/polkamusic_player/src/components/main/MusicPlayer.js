import React, { useState, useEffect, useRef } from "react";
import tracks from "./tracks";
import { Box, Button, Image, Text, Heading } from "@chakra-ui/react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import axios from "axios";
import { stringToU8a, u8aToHex, stringToHex } from "@polkadot/util";
import {
  FaPlay,
  FaPause,
  FaCaretLeft,
  FaCaretRight,
  FaVolumeUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import keyring from "@polkadot/ui-keyring";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Keyring } = require("@polkadot/keyring");

const notify = (msg) =>
  toast(`🦄 ${msg}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

async function callMintFromSource(
  keyringSourceAccount,
  nodeApi,
  tokenCategory = "token",
  tokenData = 0,
  classID = 0
) {
  if (keyringSourceAccount && nodeApi) {
    // Constuct the keying after the API (crypto has an async init)
    const keyRing = new Keyring({ type: "sr25519" });

    // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
    const alice = keyRing.addFromUri("//Alice");

    const sourceKrpair = keyring.getPair(keyringSourceAccount.address);
    console.log("source Kr pair", sourceKrpair);

    keyring.getAddresses().forEach((kra) => {
      if (kra.address?.toString() === sourceKrpair.address?.toString()) {
        console.log("Keyring source address already saved...");
      } else {
        keyring.saveAddress(sourceKrpair.address, {
          name: sourceKrpair.meta.name,
        });
      }
    });

    const nftMint = nodeApi.tx.pmNftModule.mintNftToken(
      classID,
      tokenCategory,
      tokenData
    );

    const tx = await nftMint.signAndSend(alice, { nonce: -1 });
    notify(`NFT ${tokenCategory} minted with hash ${tx}`);
    console.log(`NFT ${tokenCategory} minted with hash ${tx}`);
  }
}

async function getTokensByOwnerTemp(addr, api) {
  if (!api || !addr) {
    console.log("api or address is missing");
    return;
  }

  // token count by class id
  const [tokenClasses] = await Promise.all([api.query.nftModule.classes([])]);

  // console.log('token count', tokenClasses.value.total_issuance.words[0]);
  const tokenCount = tokenClasses?.value?.total_issuance?.words[0] || 0;

  // query owner tokens, and push to sourceTokenCollection
  let sourceTokenCollectionTemp = [];
  let tokenCountAry = [];
  console.log("tokenCount", tokenCount);
  for (let t = 0; t <= tokenCount; t++) {
    tokenCountAry.push(t);
  }
  console.log("token count array", tokenCountAry);
  for (const tokencount of tokenCountAry) {
    const usertoken = await api.query.nftModule.tokensByOwner(addr, [
      0,
      tokencount,
    ]);
    sourceTokenCollectionTemp.push(usertoken);
  }

  // console.log('sourceTokenCollection temp', sourceTokenCollectionTemp);
  const sourceTokenCollectionHasValue = sourceTokenCollectionTemp.filter(
    (utcol) => !utcol.value.isEmpty
  );
  console.log(
    "sourceTokenCollection has values",
    sourceTokenCollectionHasValue
  );

  const sourceTokenCollection = sourceTokenCollectionHasValue.map((utcol) => {
    return [utcol.value[0].words[0], utcol.value[1].words[0]];
  });
  console.log("source Token Collection", sourceTokenCollection);

  return sourceTokenCollection;
}

async function callTransferFromSource(
  keyringSourceAccount,
  nodeApi,
  classID,
  tokenID,
  keyringAccount
) {
  if (keyringSourceAccount && nodeApi && keyringAccount) {
    // Constuct the keying after the API (crypto has an async init)
    const keyRing = new Keyring({ type: "sr25519" });

    // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
    const alice = keyRing.addFromUri("//Alice");

    const krpair = keyring.getPair(keyringAccount.address);
    console.log("krpair", krpair);
    const sourceKrpair = keyring.getPair(keyringSourceAccount.address);
    console.log("source Kr pair", sourceKrpair);

    keyring.getAddresses().forEach((kra) => {
      if (kra.address?.toString() === krpair.address?.toString()) {
        console.log("Keyring address already saved...");
      } else {
        keyring.saveAddress(krpair.address, { name: krpair.meta.name });
      }
    });
    keyring.getAddresses().forEach((kra) => {
      if (kra.address?.toString() === sourceKrpair.address?.toString()) {
        console.log("Keyring sourceaddress already saved...");
      } else {
        keyring.saveAddress(sourceKrpair.address, {
          name: sourceKrpair.meta.name,
        });
      }
    });

    // signer is from Polkadot-js browser extension
    const {
      address,
      meta: { source, isInjected },
    } = krpair;
    let fromAcct;

    if (isInjected) {
      console.log("is injected", isInjected);
      const injected = await web3FromSource(source);
      fromAcct = address;
      // nodeApi.setSigner(injected.signer); // signature by alice
    } else {
      fromAcct = krpair;
    }

    console.log(typeof classID, typeof tokenID);
    console.log(classID, tokenID);
    const nft_transfer = nodeApi.tx.pmNftModule.nftTransfer(
      krpair.address,
      classID,
      tokenID
    );

    const tx = await nft_transfer.signAndSend(alice, { nonce: -1 });
    notify(`NFT transferred with hash ${tx}`);
    console.log(`NFT transferred with hash ${tx}`);
  }
}

const MotionBox = motion(Box);

function MusicPlayer() {
  const reduxState = useSelector((state) => state);
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedTime, setClickedTime] = useState();
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sourceLastMindtedTuple, setSourceLastMindtedTuple] = useState(null);
  const [sourceTupleTokens, setSourceTupleTokens] = useState(null);
  // const [xState, setXState] = useState(0);
  // const reduxState.account = useSelector((state) => {
  //   return state?.account || "";
  // });

  const x = useMotionValue(0);

  // Destructure for conciseness
  const { title, artist, color, image, audioSrc, song_src } = 
    tracks[trackIndex];

  const initialValues = {
    song_src: 0,
    duration: 0,
    user_publickey: reduxState?.account || 0,
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
    console.log("current time", currentTime);
    console.log("duration", duration);
    if (isNaN(currentTime) || isNaN(duration)) return;
    const curPercentage = (currentTime / duration) * 100;
    console.log("current percentage", curPercentage);
    const scaleRes = scale(curPercentage, 0, 100, 0, 800);
    console.log("scale res", scaleRes);
    // setXState(scaleRes);
    x.set(scaleRes);
    x.get();
  }, [currentTime, duration]);

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const sendData = (values) => {
    axios.post("http://localhost:5000/api/reports", values).then((res) => {
      console.log("reports data", res.data);
    });

    if (currentTime > 30.0) {
      callMintFromSource(
        reduxState.keyringSourceAccount,
        reduxState.nodeApi,
        "H",
        0,
        0
      ).catch(console.error);

      setTimeout(() => {
        getTokensByOwnerTemp(
          reduxState.keyringSourceAccount.address,
          reduxState.nodeApi
        ).then((results) => {
          const recentMint = results[results.length - 1];
          if (recentMint) {
            callTransferFromSource(
              reduxState.keyringSourceAccount,
              reduxState.nodeApi,
              recentMint[0],
              recentMint[1],
              reduxState.keyringAccount
            ).catch(console.error);
          }
        });
      }, 9000);
    }

    // medium nft mint
    if (currentTime > 20.0 && currentTime <= 30.0) {
      // random 1 - 8
      const mrand = getRandomInt(1, 8);
      callMintFromSource(
        reduxState.keyringSourceAccount,
        reduxState.nodeApi,
        `M${mrand}`,
        0,
        0
      ).catch(console.error);

      setTimeout(() => {
        getTokensByOwnerTemp(
          reduxState.keyringSourceAccount.address,
          reduxState.nodeApi
        ).then((results) => {
          console.log("medium results", results);
          const recentMint = results[results.length - 1];
          if (recentMint) {
            callTransferFromSource(
              reduxState.keyringSourceAccount,
              reduxState.nodeApi,
              recentMint[0],
              recentMint[1],
              reduxState.keyringAccount
            ).catch(console.error);
          }
        });
      }, 9000);
    }

    // easy nft mint
    if (currentTime > 10.0 && currentTime <= 20.0) {
      // random 1 - 16
      const mrand = getRandomInt(1, 16);
      callMintFromSource(
        reduxState.keyringSourceAccount,
        reduxState.nodeApi,
        `E${mrand}`,
        0,
        0
      ).catch(console.error);

      setTimeout(() => {
        getTokensByOwnerTemp(
          reduxState.keyringSourceAccount.address,
          reduxState.nodeApi
        ).then((results) => {
          console.log("ez results", results);
          const recentMint = results[results.length - 1];
          console.log("recent mint", recentMint);
          if (recentMint) {
            callTransferFromSource(
              reduxState.keyringSourceAccount,
              reduxState.nodeApi,
              recentMint[0],
              recentMint[1],
              reduxState.keyringAccount
            ).catch(console.error);
          }
        });
      }, 9000);
    }
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
    console.log("acct state", reduxState.account);
    if (isPlaying) {
      audioRef.current.play();
      audioRef.current.volume = 1;
    } else {
      audioRef.current.pause();
      console.log("Paused Now Data will be Send");
      sendData({
        song_src: song_src,
        duration: currentTime,
        user_publickey: reduxState.account,
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    console.log('track idx state n play', reduxState.trackIndex);
    if (reduxState && reduxState.trackIndex && reduxState.trackIndex.clicked) {
      setIsPlaying(true)
    }
   
  }, [reduxState.trackIndex])

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
    <>
      <ToastContainer />
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
        {/* <MotionBox d="flex" alignItems="center" bg="gray.500" h="0.5" w="800px">
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
        </MotionBox> */}
        <Box
          mr={4}
          d="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          color="white"
          onClick={handleVol}
          _hover={{ color: "pink.500" }}
        >
          <Box color="white" mr={1}>
            Current Duration: {cur}
          </Box>
          <Box color="white" ml={2}>
            Total Duration: {dur}
          </Box>
          {/* <FaVolumeUp /> */}
        </Box>
      </Box>
    </>
  );
}

export default MusicPlayer;
