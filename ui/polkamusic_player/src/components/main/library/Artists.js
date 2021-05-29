import React, { useState } from "react";
import {
  Text,
  Heading,
  Box,
  Stack,
  HStack,
  Image,
  Flex,
} from "@chakra-ui/react";
import Wallet from "../Wallet";


function Artists(props) {
  // const [keyringAccts, setKeyringAccts] = useState(null);

  return (
    <Box h="100vh" backgroundColor="blackAlpha.900" width="100%">
      <Box
        color="white"
        ml={32}
        background="blackAlpha.300"
        my={8}
        d="flex"
        justifyContent="space-between"
      >
        <Box>
          <Text color="pink.500" fontWeight="medium">
            Artists
          </Text>
          <Heading>Popular</Heading>
        </Box>
        <Wallet keyringAccts={props.keyringAccts} nodeApi={props.nodeApi} />
      </Box>
      <HStack mx={32} spacing="24px">
        <Box width="200px" borderRadius="xl" background="blue.900">
          <Image
            src="https://via.placeholder.com/200"
            alt="Rihana"
            objectFit="cover"
            borderRadius="xl"
            borderBottomRadius="0"
            mx="auto"
          />
          <Heading color="white" textAlign="center" fontSize="md" mt={4}>
            Rihanna
          </Heading>
          <Text
            color="gray.100"
            mb={4}
            textAlign="center"
            fontFamily="sans-serif"
          >
            Consideration
          </Text>
        </Box>
        <Box width="200px" borderRadius="xl" background="purple.700">
          <Image
            src="https://via.placeholder.com/200"
            alt="Rihana"
            objectFit="cover"
            borderRadius="xl"
            borderBottomRadius="0"
            mx="auto"
          />
          <Heading color="white" textAlign="center" fontSize="md" mt={4}>
            Eminem
          </Heading>
          <Text
            color="gray.100"
            mb={4}
            textAlign="center"
            fontFamily="sans-serif"
          >
            Beautiful
          </Text>
        </Box>
        <Box width="200px" borderRadius="xl" background="pink.900">
          <Image
            src="https://via.placeholder.com/200"
            alt="Rihana"
            objectFit="cover"
            borderRadius="xl"
            borderBottomRadius="0"
            mx="auto"
          />
          <Heading color="white" textAlign="center" fontSize="md" mt={4}>
            Mac Miller
          </Heading>
          <Text
            color="gray.100"
            mb={4}
            textAlign="center"
            fontFamily="sans-serif"
          >
            Best Day
          </Text>
        </Box>
        <Box width="200px" borderRadius="xl" background="cyan.900">
          <Image
            src="https://via.placeholder.com/200"
            alt="Rihana"
            objectFit="cover"
            borderRadius="xl"
            borderBottomRadius="0"
            mx="auto"
          />
          <Heading color="white" textAlign="center" fontSize="md" mt={4}>
            Kendrick Lamar
          </Heading>
          <Text
            color="gray.100"
            mb={4}
            textAlign="center"
            fontFamily="sans-serif"
          >
            Blood
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export default Artists;
