import { create } from 'ipfs-http-client';


const ipfs = create();

(async () => {
    await ipfs.pin.remote.service.add('pinata', { endpoint: 'https://api.pinata.cloud/psa', key: `${process.env.PINATA_JWT}` })
    console.log("Available services:")
    console.log(await ipfs.pin.remote.service.ls())
})();
