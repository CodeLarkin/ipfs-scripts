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

// Load all images into memory
let files = []
let results = []
for (let i = 0; i < numNFTs; i++) {
    console.log(`Processing image ${i}...`)
    const fname = `./gen-metas/${i}.json`
    const img = fs.readFileSync(fname)
    const fileObj = { path: `/skullys/${i}`, content: img }
    files.push(fileObj)
}

// Add all of the files and store off the root CID
let rootCID;
for await (const res of ipfs.addAll(files, ipfsAddOptions)) {
    if (res.path == 'skullys') {
        rootCID = res.cid.toString()
    }
    console.log(res)
}

process.exit()
