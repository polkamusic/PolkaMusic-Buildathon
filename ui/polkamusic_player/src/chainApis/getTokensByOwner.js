

async function getTokensByOwner(addr, api, classAndTokenID, getUserTokens) {
    if (!api || !addr) {
        console.log('api or address is missing')
        return
    }

    const [userTokens] = await Promise.all([
    
        api.query.nftModule.tokensByOwner(addr, classAndTokenID) // addr = account id
    ]);

    console.log('user tokens', userTokens);

    // return userTokens
    getUserTokens(userTokens);
}

export default getTokensByOwner


