//import * as IPFS from 'ipfs-core'
//
//const ipfs = await IPFS.create()
//const { cid } = await ipfs.add('Hello world')
//console.info(cid)
//// QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf

import { create } from 'ipfs-http-client';

import fs from 'fs';


const ipfs = create()
let services = await ipfs.pin.remote.service.ls()
if (services[0].service != 'pinata') {
    await ipfs.pin.remote.service.add('pinata', { endpoint: 'https://api.pinata.cloud', key: `${process.env.PINATA_JWT}` })
}
console.log("Available services:")
console.log(await ipfs.pin.remote.service.ls())

const ipfsAddOptions = {
  cidVersion: 1,
  hashAlg: 'sha2-256'
}
const numNFTs = 2 //1000
let results = []
for (let i = 0; i < numNFTs; i++) {
    console.log(`Processing image ${i}...`)
    const fname = './images/' + i + '.png'
    const img = fs.readFileSync(fname)
    const res = await ipfs.add(img, ipfsAddOptions)
    //console.log(res)
    results.push(res)
}

console.log(results)

process.exit()
