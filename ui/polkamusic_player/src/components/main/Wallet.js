import React, { useEffect, useState } from "react";
import { Box, Text, Select } from "@chakra-ui/react";
import getAddressBalance from "../../chainApis/getAddressBalance";
import { polmTypes } from "../../chainApis/customTypes";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../redux/Actions";

function Wallet(props) {
  const [selectAddresses, setSelectAddresses] = useState([]);
  const [addressValues, setAddressValues] = useState(null);
  const [keyringAccount, setKeyringAccount] = useState(null);
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();

  // connecting wallet
  useEffect(() => {
    // console.log('redux kr accts', reduxState.keyringAccounts);
    if (!reduxState || !reduxState.keyringAccounts 
      || reduxState.keyringAccounts?.length === 0) return;
    // get accounts where meta data field has source
    // meta: { source: data }, indicates account from a wallet address
    const walletAccounts = reduxState.keyringAccounts.filter(
      krAcct => !!krAcct.meta.source);
    // console.log('wallet accounts', walletAccounts);
    if (walletAccounts && walletAccounts.length > 0) {
      // set first address as initial address value
      setAddressValues(oldValues => ({
        ...oldValues,
        'wallet-addresses': walletAccounts[0].address
      }));

      // set addresses for selection/ dropdown/ select options
      // console.log(walletAccounts[0])
      const addressesOptions = walletAccounts.map(account => ({
        'addressValue': account.address,
        'addressDisplay': account.meta.name
        // `${account.address.toString().toString().slice(0, 5)}...${walletAccounts[0].address.toString().slice(account.address.toString().length - 5)}`
      }));
      setSelectAddresses([{ addressValue: '', addressDisplay: 'Select Wallet' }, ...addressesOptions]);

      const initialAddr = walletAccounts[0].address;

      // store address ,redux
      dispatch({
        type: ACTIONS.SET_ACCOUNT,
        payload: {
          newAcct: initialAddr
        }
      });

      // find keyring account, set to keyring account state
      // for future use e.g. adding to keyring addresses, etc
      if (reduxState.keyringAccounts && initialAddr) {
        reduxState.keyringAccounts.forEach(krAcct => {
          // console.log('kr Acct', krAcct);
          if (krAcct.address?.toString() === initialAddr.toString()) {
            if (krAcct) setKeyringAccount(krAcct);
          }
        })
      }

      // balance for the address
      if (reduxState && reduxState.nodeApi)
        getAddressBalance(initialAddr, reduxState?.nodeApi);
    }

  }, []);

  return (
    <Box
      w="30%"
      height="80px"
      d="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      borderRadius="md"
      p={3}
      mb={3}
      mr={2}
    >
      {/* <Box color="pink.900">Select Wallet</Box> */}
      {/* <Text fontSize="sm" color="gray.500" p={1}>
        Wallet will be here and a drop down button
      </Text> */}
      <Select
        w="100%"
        borderWidth="1px"
        borderRadius="6px"
        style={
          // { boxShadow: '0 0 15px 7.5px #fff, 0 0 25px 15px #f0f, 0 0 35px 27.5px #0ff'}
          { boxShadow: '0 0 1px 1px #fff, 0 0 3px 1.5px #f0f, 0 0 6px 3px white' }
        }
        focusBorderColor="pink.500"
        borderColor="pink.400"
        color="pink.500"
        size="lg"
        value={reduxState?.account || "Select Wallet"}
        onChange={(event) => {
          console.log('on change wallet', event.target.value);
          dispatch({
            type: ACTIONS.SET_ACCOUNT,
            payload: {
              newAcct: event.target?.value || ""
            }
          });
        }}
      >
        {selectAddresses.length === 0
          && (<option style={{ background: "black" }} value="option1">Wallet not available</option>)
        }
        {
          selectAddresses.length > 0 && selectAddresses.map(selectAddress => (
            <option style={{ background: "black" }} value={selectAddress.addressValue}>{selectAddress.addressDisplay}</option>
          ))
        }
      </Select>
    </Box>
  );
}

export default Wallet;
