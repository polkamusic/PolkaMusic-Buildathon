import React, { useState } from "react";
import { Heading, Flex, Box, Button } from "@chakra-ui/react";
import { motion, useMotionValue } from "framer-motion";

const MotionBox = motion(Box);

function Albums() {
  const [point, setPoint] = useState(0);
  console.log(point);
  // const x = setInterval(() => {}, 1000);

  const x = useMotionValue(0);

  x.set(400);

  return (
    <Flex alignItems="center" justifyContent="center" width="100%" h="100vh">
      <MotionBox d="flex" alignItems="center" bg="gray.500" h="0.5" w="800px">
        <MotionBox
          style={{ x }}
          w="1rem"
          h="1rem"
          bg="pink.500"
          borderRadius="full"
          whileHover={{ scale: 1.4 }}
          drag="x"
          dragConstraints={{ left: 0, right: 800 }}
          dragElastic={0}
          dragMomentum={false}
        ></MotionBox>
      </MotionBox>
      {/* <Button>Click</Button> */}
    </Flex>
  );
}

export default Albums;
