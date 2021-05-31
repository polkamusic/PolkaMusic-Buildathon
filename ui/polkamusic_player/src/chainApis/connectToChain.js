import { ApiPromise, WsProvider } from '@polkadot/api';

// function connectToChain() {
    // call once should be redux state
    // if (apiState) return;

    async function connectToChain(wsprovider, setChainApi, customTypes=null) {
        // Initialise the provider to connect to the local node
        const provider = new WsProvider(wsprovider); // change if prod/staging

        // Create the API and wait until ready
        const api = await ApiPromise.create({
            provider,
            types: customTypes,
        })

        // Retrieve the chain & node information information via rpc calls
        // const addr = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
        const [chain, nodeName, nodeVersion, balances] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version(),
            // api.query.balances.account(addr)
        ]);

        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
        
        // console.log('balance', balances)
        setChainApi(api);
    }

    // connectToChain()
    //     .catch(console.error)
        // .finally(() => setApiState("READY"));
// }

export default connectToChain