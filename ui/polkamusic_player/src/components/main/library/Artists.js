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
            // src="https://via.placeholder.com/200"
            src="https://upload.wikimedia.org/wikipedia/en/d/d1/Rihanna_-_Loud.png"
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
            src="https://i.pinimg.com/originals/3f/9b/1a/3f9b1ab0095226f5af5f5720e1a49acd.jpg"
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
            src="https://i.pinimg.com/originals/7c/70/60/7c706032eb0b13161d9d3f1a6b9063d7.jpg"
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
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdH9GHSeXi6zKfVNUYi8TPmOZ-1LbHzFzIRg&usqp=CAU"
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
