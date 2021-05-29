import React, { useEffect, useState } from "react";
import { Heading, Flex, Button } from "@chakra-ui/react";
import NftPuzzle from "../../images/nftPuzzle";
import getTokensByOwner from "../../../chainApis/getTokensByOwner";
import getTokens from "../../../chainApis/getTokens";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text } from "@chakra-ui/react";
import {
  u8aToString
} from '@polkadot/util';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { easyTokensMap } from "../../../chainApis/easyTokensMap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callBurnEasyNfts from '../../../chainApis/callBurnEasyNfts'

function NFT() {
  const reduxState = useSelector((state) => state);
  const [hardNftTokens, setHardNftTokens] = useState([]);
  const [mediumNftTokens, setMediumNftTokens] = useState([]);
  const [nftTokens, setNftTokens] = useState([])
  const [userTokenIDs, setUserTokenIDs] = useState(null) // change to array if code changes from node
  const [disableBurnEasyButton, setDisableBurnEasyButton] = useState(true)
  const [disableBurnMediumButton, setDisableBurnMediumButton] = useState(true)
  const [disableBurnHardButton, setDisableBurnHardButton] = useState(true)
  const [glowHeadphones, setGlowHeadphones] = useState(false)
  const [easyNftCompleted, setEasyNftCompleted] = useState(false)
  const [easyTupleTokens, setEasyTupleTokens] = useState(null)
  const notify = (msg) => toast(`🦄 ${msg}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const ButtonModal = ({ value, disableBurnButton, btnHeight, btnWidth }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <Button
          height={btnHeight}
          width={btnWidth}
          mb={2}
          onClick={onOpen}
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          _hover={{ bgGradient: "linear(to-l,#ff0080,#ec7309)" }}
          color="white"
          disabled={disableBurnButton}
          style={
            !disableBurnButton ?
              { boxShadow: '0 0 1px 1px #fff, 0 0 3px 1.5px #f0f, 0 0 6px 3px white' } :
              {}
          }
        >
          {value}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Are you sure you want to Burn 16 Easy Tokens
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              This is the Modal Body {value}
              <Box>
                <Button variant="ghost" onClick={() => {
                  setGlowHeadphones(true)
                  setEasyNftCompleted(true)
                  // burn nfts at node
                  // console.log('nfts to burn', easyTupleTokens);
                  const easyTupleTokensTemp = [[0, 17]]
                  console.log('nfts to burn', easyTupleTokensTemp);
                  for (const ezTuple of easyTupleTokensTemp) {
                    //callBurnEasyNfts(keyringBurnAccount, nodeApi, classID, tokenID, keyringAccount) 
                    callBurnEasyNfts(
                      reduxState.keyringBurnAccount,
                      reduxState.nodeApi, 
                      ezTuple[0], ezTuple[1],
                      reduxState.keyringAccount
                    )
                  }
                  notify("NFT Claimed")
                  // back to normal
                  setTimeout(() => {
                    setGlowHeadphones(false)
                  }, 2000);

                }} >Click to Redeem</Button>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  useEffect(() => {
    console.log('nft redux', reduxState);
    if (!reduxState || !reduxState.account || !reduxState.nodeApi) return;
    // get tokens and display
    let userTokens;
    async function getTokensByOwnerTemp(addr, api, getUserTokens) {
      if (!api || !addr) {
        console.log('api or address is missing')
        return
      }

      const [userTokensOwner] = await Promise.all([
        api.query.nftModule.tokensByOwner(addr, []) // addr = account id
      ]);
      console.log('userTokensOwner', userTokensOwner);

      // const [userTokens] = await Promise.all([
      //   api.query.nftModule.tokenIdByOwner(addr) // addr = account id
      // ]);

      // token count by class id
      const [tokenClasses] = await Promise.all([
        api.query.nftModule.classes([]) // addr = account id
      ]);

      console.log('token count', tokenClasses.value.total_issuance.words[0]);
      const tokenCount = tokenClasses?.value?.total_issuance.words[0] || 0;

      // query owner tokens, and push to userTokenCollection 
      let userTokenCollectionTemp = [];
      let tokenCountAry = [];
      for (let t = 0; t < tokenCount; t++) { tokenCountAry.push(t) }
      console.log('token count array', tokenCountAry);
      for (const tokencount of tokenCountAry) {
        const usertoken = await api.query.nftModule.tokensByOwner(addr, [0, tokencount])
        userTokenCollectionTemp.push(usertoken)

      }

      // console.log('userTokenCollection temp', userTokenCollectionTemp);
      const userTokenCollectionHasValue = userTokenCollectionTemp.filter(utcol => !utcol.value.isEmpty)
      console.log('userTokenCollection has values', userTokenCollectionHasValue);

      const userTokenCollection = userTokenCollectionHasValue.map(utcol => {
        return [utcol.value[0].words[0], utcol.value[1].words[0]]

      })
      console.log('userTokenCollection', userTokenCollection);

      // TokensByOwner
      // const [userTokens] = await Promise.all([
      //   api.query.nftModule.tokensByOwner(addr, []) // addr = account id
      // ]);

      // console.log('user Token class id', userTokens.value[0].words[0]);
      // console.log('user Token token id', userTokens.value[1].words[0]);

      // const [userTokenCID, userTokenTID] = userTokens
      // console.log(userTokenCID.words[0], userTokenTID.words[0]);

      // return [userTokenCID.words[0], userTokenTID.words[0]]
      // return [userTokens.value[0].words[0], userTokens.value[1].words[0]]
      setEasyTupleTokens(userTokenCollection)
      return userTokenCollection
    }
    getTokensByOwnerTemp(reduxState.account, reduxState.nodeApi)
      .then(results => {
        console.log('user token id/s', results);
        setUserTokenIDs(results)
      });


  }, [reduxState.account, reduxState.nodeApi])

  useEffect(() => {
    console.log('user token ids', userTokenIDs);
    if (userTokenIDs) {

      async function getTokens(userTokCollect, api) {
        // if (!classID || !tokenID || !api) {
        //     console.log('classID or tokenID is missing')
        //     return
        // }

        console.log('userTokCollect', userTokCollect);
        let nftDataCollection = [];
        for (const utc of userTokCollect) {
          const nftdata = await api.query.nftModule.tokens(utc[0], utc[1])
          nftDataCollection.push(nftdata)
        }
        console.log('nftDataCollection', nftDataCollection);

        // const [nftData] = await Promise.all([
        //   // query nft chain state
        //   api.query.nftModule.tokens(classID, tokenID)
        // ]);

        // console.log('user nft data', nftData);

        const nftDataCollectionFormated = nftDataCollection.map(nftdc => u8aToString(nftdc.value.metadata))
        console.log('nftDataCollection formated', nftDataCollectionFormated);

        // const someNft = Some(nftData.value)
        // const someNft = u8aToString(nftData.value.metadata);
        // setNftTokens([ ...nftTokens, someNft])
        return nftDataCollectionFormated

      }

      getTokens(userTokenIDs, reduxState.nodeApi)
        .then(results => {
          console.log('nft tokens', results);
          if (results)
            // setNftTokens([ ...nftTokens, ...results]) // change logic for array of nft data
            setNftTokens(results)
          // check goals/completeness for each token categories
          // for (const [key, value] of Object.entries(easyTokensObj)) {
          //   console.log(`${key}: ${value}`);

          // }

          for (let i = 0; i < results.length; i++) {
            const token = results[i];
            if (!easyTokensMap[token]) {
              setDisableBurnEasyButton(true);
              break;
            } else {
              setDisableBurnEasyButton(false);
              // add shadow glow
            }
          }
        })
    }

  }, [reduxState.account, reduxState.nodeApi, userTokenIDs])

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      width="100%"
      h="100vh"
    >
      <ToastContainer />
      {/* <Box
        w="30%"
        height="30px"
        d="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        borderRadius="md"
        p={3}
        mb={3}
        mr={2}
      >
        <Text fontSize="sm" color="gray.500" p={1}>
          Puzzle Pieces : {nftTokens.join(", ") || ""}

        </Text>
      </Box> */}
      <Flex alignItems="center" justifyContent="center" direction="row" mb={8}>
        <NftPuzzle nftTokens={nftTokens} glowHeadphones={glowHeadphones} />
        <Box d="flex" flexDir="column" ml={3}>
          <Box
            borderRadius="md"
            height="120px"
            mb={6}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            color="white"
          >
            <Text fontSize="md" color="gray.100" p={2}>
              Easy NFT &nbsp; &nbsp; &nbsp; {nftTokens && (nftTokens.length === 16) ? `${easyNftCompleted ? 'Claimed' : 'Cleared'}!` : `${nftTokens.length}/16`}
            </Text>
            <Text fontSize="md" color="gray.100" p={2}>
              Medium NFT &nbsp;{mediumNftTokens && (mediumNftTokens.length === 8) ? " Cleared!" : `${mediumNftTokens.length}/8`}
            </Text>
            <Text fontSize="md" color="gray.100" p={2}>
              Hard NFT  &nbsp; &nbsp; &nbsp; {hardNftTokens && (hardNftTokens.length) === 1 ? " Cleared!" : `${hardNftTokens.length}/1`}
            </Text>
          </Box>

          <ButtonModal
            value="Get a Coffee Mug"
            // disableBurnButton={disableBurnEasyButton}
            disableBurnButton={false}
          />
          <ButtonModal value="Get a Concert Ticket" disableBurnButton={disableBurnMediumButton} />
          <ButtonModal value="Get a BMW M5" disableBurnButton={disableBurnHardButton} />
        </Box>
      </Flex>

    </Flex>
  );
}

export default NFT;
