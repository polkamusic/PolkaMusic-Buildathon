



async function burnEasyNftsAtNode(addr, api, classAndTokenID) {
    if (!api || !addr) {
        console.log('api or address is missing')
        return
    }

    const [response] = await Promise.all([
        api.query.nftModule.burn(addr, classAndTokenID) // addr = account id
    ]);

    console.log('burn ez tokens', response);

    return response
}

export default burnEasyNftsAtNode


