
async function getAddressBalance(addr, api) {
    // Retrieve the account balance & nonce via the system module
    if (!api || !addr) {
        console.log('api or address is missing')
        return
    }

    // const { nonce, data: balance } = await api.query.system.account(addr)
    // Retrieve last block timestamp, account nonce & balances
    const [balances] = await Promise.all([
        // api.query.timestamp.now(),
        // api.query.system.account(addr)
        api.query.balances.account(addr)
    ]);

    console.log('balances', balances);

    return balances.free
}

export default getAddressBalance