import { create } from 'ipfs-http-client';

const ipfs = create()
let services = await ipfs.pin.remote.service.ls()
await ipfs.pin.remote.service.rm('pinata')
console.log("Available services:")
console.log(await ipfs.pin.remote.service.ls())
