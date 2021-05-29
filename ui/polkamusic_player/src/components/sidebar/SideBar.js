import React from "react";
import { Image, Box, Text, Spacer, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  MdLibraryMusic,
  MdPerson,
  MdAlbum,
  MdStore,
  MdFavorite
} from "react-icons/md";
import { FaPuzzlePiece } from "react-icons/fa";
import { 
  IoExtensionPuzzle,
  IoExtensionPuzzleOutline 
} from "react-icons/io";
import { IoRadio } from "react-icons/io5";
import { RiMusic2Fill } from "react-icons/ri";
import logo from "../images/logo.png";

function SideBar() {
  return (
    <Flex
      background="blackAlpha.900"
      h="90vh"
      width="264px"
      flexDir="column"
      borderRight="2px"
      borderColor="gray.600"
    >
      <Box
        height="50px"
        width="100%"
        mt={3}
        alignItems="flex-start"
        d="flex"
        alignItems="center"
        ml={4}
        mb={2}
      >
        <Image objectFit="cover" height="50px" alt="polkamusic" src={logo} />
        <Text
          fontSize="md"
          fontWeight="bold"
          letterSpacing="wide"
          color="white"
          ml={1}
        >
          PolkaMusic
        </Text>
      </Box>
      <Box d="flex" alignItems="flex-start" width="100%" height="25px" mb={3}>
        <Text
          color="gray.300"
          fontSize="sm"
          align="left"
          ml={4}
          fontWeight="extrabold"
          letterSpacing="widest"
        >
          LIBRARY
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/lib/playlist"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <MdLibraryMusic />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Playlists
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/lib/artists"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <MdPerson />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Artists
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/lib/albums"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <MdAlbum />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Albums
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/lib/songs"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <RiMusic2Fill />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Songs
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/lib/nft"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <FaPuzzlePiece />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          NFT
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        height="25px"
        width="100%"
        mb={2}
        mt={10}
      >
        <Text
          color="gray.300"
          fontSize="sm"
          align="left"
          fontWeight="extrabold"
          letterSpacing="widest"
          ml={4}
        >
          DISCOVER
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/dis/store"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <MdStore />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Store
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/dis/radio"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <IoRadio />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Radio
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/dis/favorite"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <MdFavorite />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Favorite
        </Text>
      </Box>
      <Box
        d="flex"
        alignItems="center"
        width="100%"
        justifyContent="flex-start"
        as={Link}
        to="/dis/browse"
      >
        <Box
          color="whiteAlpha.500"
          fontSize="lg"
          ml={4}
          _hover={{
            color: "red.500",
          }}
        >
          <RiMusic2Fill />
        </Box>
        <Text
          ml={2}
          color="whiteAlpha.800"
          fontSize="lg"
          _hover={{
            color: "red.500",
          }}
        >
          Browse
        </Text>
      </Box>
    </Flex>
  );
}

export default SideBar;
