



async function getTokens(classID, tokenID, api) {
    if (!classID || !tokenID || !api) {
        console.log('classID or tokenID is missing')
        return
    }

    const [tokens] = await Promise.all([
        // query nft chain state
        api.query.nftModule.tokens(classID, tokenID)
    ]);

    console.log('tokens', tokens);

    return tokens
}

export default getTokens