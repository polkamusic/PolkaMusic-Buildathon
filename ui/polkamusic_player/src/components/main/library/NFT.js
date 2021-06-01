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
import { mediumTokensMap } from "../../../chainApis/mediumTokensMap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import callBurnEasyNfts from '../../../chainApis/callBurnEasyNfts'
import callMultiBurnNfts from "../../../chainApis/callMultiBurnNfts";

function NFT() {
  const reduxState = useSelector((state) => state);
  const [easyNftTokens, setEasyNftTokens] = useState([]);
  const [hardNftTokens, setHardNftTokens] = useState([]);
  const [mediumNftTokens, setMediumNftTokens] = useState([]);
  const [nftTokens, setNftTokens] = useState([])
  const [userTokenIDs, setUserTokenIDs] = useState(null) // change to array if code changes from node
  const [disableBurnEasyButton, setDisableBurnEasyButton] = useState(true)
  const [disableBurnMediumButton, setDisableBurnMediumButton] = useState(true)
  const [disableBurnHardButton, setDisableBurnHardButton] = useState(true)
  const [glowHeadphones, setGlowHeadphones] = useState(false)
  const [easyNftCompleted, setEasyNftCompleted] = useState(false)
  const [mediumNftCompleted, setMediumNftCompleted] = useState(false)
  const [hardNftCompleted, setHardNftCompleted] = useState(false)

  const [easyTupleTokens, setEasyTupleTokens] = useState(null)
  const [tokenCategoryTupleMap, setTokenCategoryTupleMap] = useState(null)
  const notify = (msg) => toast(`🦄 ${msg}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const ButtonModal = ({ value, disableBurnButton, btnHeight, btnWidth, tokenCount, tokenCategory }) => {
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
              Are you sure you want to Burn {tokenCount} {tokenCategory} Token{tokenCount === 1 ? '' : 's'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {value}
              <Box>
                <Button variant="ghost" onClick={() => {
                  setGlowHeadphones(true)
                  // burn nfts at node

                  console.log('nfts to burn', tokenCategoryTupleMap);
                  console.log('tokenCategory TupleMap to burn', tokenCategoryTupleMap);


                  if (!tokenCategoryTupleMap || !nftTokens) return
                  // get tokenCategory, filter nft tokens
                  let filteredNftTokens = []
                  if (tokenCategory === "Hard") {
                    filteredNftTokens = nftTokens.filter(nfttoken => nfttoken === "H")
                    setHardNftCompleted(true)
                    for (const nftToken of filteredNftTokens) {
                      const tokenTuple = tokenCategoryTupleMap[nftToken]
                      //callBurnEasyNfts(keyringBurnAccount, nodeApi, classID, tokenID, keyringAccount) 
                      callBurnEasyNfts(
                        reduxState.keyringBurnAccount,
                        reduxState.nodeApi,
                        tokenTuple[0],
                        tokenTuple[1],
                        reduxState.keyringAccount,
                        notify
                      ).catch((err) => {
                        notify(err)
                        return console.error
                      })
                    }
                  }
                  if (tokenCategory === "Medium") {
                    filteredNftTokens = nftTokens.filter(nfttoken => nfttoken.includes("M"))
                    setMediumNftCompleted(true)

                    let tokenTuplesToBurn = []
                    for (const nftToken of filteredNftTokens) {
                      const tokenTuple = tokenCategoryTupleMap[nftToken]
                      tokenTuplesToBurn.push(tokenTuple)
                    }
                    // callMultiBurnNfts(keyringBurnAccount, nodeApi, tokenTuplesToBurn, keyringAccount, notify)
                    callMultiBurnNfts(
                      reduxState.keyringBurnAccount,
                      reduxState.nodeApi,
                      tokenTuplesToBurn,
                      reduxState.keyringAccount,
                      notify
                    ).catch((err) => {
                      notify(err)
                      return console.error
                    })
                  }
                  if (tokenCategory === "Easy") {
                    filteredNftTokens = nftTokens.filter(nfttoken => nfttoken.includes("E"))
                    setEasyNftCompleted(true)
                    let tokenTuplesToBurn = []
                    for (const nftToken of filteredNftTokens) {
                      const tokenTuple = tokenCategoryTupleMap[nftToken]
                      tokenTuplesToBurn.push(tokenTuple)
                    }
                    // callMultiBurnNfts(keyringBurnAccount, nodeApi, tokenTuplesToBurn, keyringAccount, notify)
                    callMultiBurnNfts(
                      reduxState.keyringBurnAccount,
                      reduxState.nodeApi,
                      tokenTuplesToBurn,
                      reduxState.keyringAccount,
                      notify
                    ).catch((err) => {
                      notify(err)
                      return console.error
                    })
                  }

      

                 
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

      // token count by class id
      const [tokenClasses] = await Promise.all([
        api.query.nftModule.classes([]) // addr = account id
      ]);

      // console.log('token count', tokenClasses.value.total_issuance.words[0]);
      const tokenCount = tokenClasses?.value?.total_issuance?.words[0] || 0;

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
        console.log('userTokCollect', userTokCollect);
        let nftDataCollection = [];
        let tokenCategoryTupleMap = {}
        for (const utc of userTokCollect) {
          const nftdata = await api.query.nftModule.tokens(utc[0], utc[1])
          nftDataCollection.push(nftdata)
          tokenCategoryTupleMap[u8aToString(nftdata.value.metadata)] = utc
        }
        console.log('nftDataCollection', nftDataCollection);

        console.log('tokenCategoryTupleMap', tokenCategoryTupleMap);
        const nftDataCollectionFormated = nftDataCollection.map(nftdc => u8aToString(nftdc.value.metadata))
        console.log('nftDataCollection formated', nftDataCollectionFormated);

        setTokenCategoryTupleMap(tokenCategoryTupleMap)
        return nftDataCollectionFormated
      }

      getTokens(userTokenIDs, reduxState.nodeApi)
        .then(results => {
          console.log('nft tokens', results);
          if (results) setNftTokens(results)

          let ezcounter = 0;
          let medcounter = 0;
          let hcounter = false;
          let prevToken = "";
          let prevMedToken = "";

          let ezNftTokens = [];
          let medNftTokens = [];
          let hardNftTokens = [];
          for (let i = 0; i < results.length; i++) {
            const token = results[i];
            console.log('easy token map', easyTokensMap[token])
            if (easyTokensMap[token] && prevToken !== token) {
              ezcounter++
              ezNftTokens.push(token)
              prevToken = token
            }

            if (mediumTokensMap[token] && prevMedToken !== token) {
              medcounter++
              medNftTokens.push(token)
              prevMedToken = token
            }

            if (token === "H") {
              hcounter = true
              hardNftTokens.push(token)
            }

          }

          console.log('ez counter', ezcounter);
          console.log('med counter', medcounter);

          console.log('h counter', hcounter);

          ezcounter >= 16 ? setDisableBurnEasyButton(false) : setDisableBurnEasyButton(true)
          medcounter >= 8 ? setDisableBurnMediumButton(false) : setDisableBurnMediumButton(true)
          setDisableBurnHardButton(!hcounter)
          setEasyNftTokens(ezNftTokens)
          setMediumNftTokens(medNftTokens)
          setHardNftTokens(hardNftTokens)
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
              Easy NFT &nbsp; &nbsp; &nbsp; {easyNftTokens && (easyNftTokens.length === 16) ? `${easyNftCompleted ? 'Claimed' : 'Cleared'}!` : `${easyNftTokens.length >= 16 ? '16' : easyNftTokens.length}/16`}
            </Text>
            <Text fontSize="md" color="gray.100" p={2}>
              Medium NFT &nbsp;{mediumNftTokens && (mediumNftTokens.length === 8) ? `${mediumNftCompleted ? 'Claimed' : 'Cleared'}!` : `${mediumNftTokens.length >= 8 ? '8' : mediumNftTokens.length}/8`}
            </Text>
            <Text fontSize="md" color="gray.100" p={2}>
              Hard NFT  &nbsp; &nbsp; &nbsp; {hardNftTokens && (hardNftTokens.length) === 1 ? `${hardNftCompleted ? 'Claimed' : 'Cleared'}!` : `${hardNftTokens.length}/1`}
            </Text>
          </Box>

          <ButtonModal
            value="Get a Coffee Mug"
            disableBurnButton={disableBurnEasyButton}
            tokenCategory="Easy"
            tokenCount={16}
          />
          <ButtonModal
            value="Get a Concert Ticket"
            disableBurnButton={disableBurnMediumButton}
            tokenCount={8}
            tokenCategory="Medium"
          />
          <ButtonModal
            value="Get a BMW M5"
            disableBurnButton={disableBurnHardButton}
            tokenCount={1}
            tokenCategory="Hard"
          />
        </Box>
      </Flex>

    </Flex>
  );
}

export default NFT;
