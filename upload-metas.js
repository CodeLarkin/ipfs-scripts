import { create } from 'ipfs-http-client';

import fs from 'fs';


const ipfs = create()

console.log("Available services:")
console.log(await ipfs.pin.remote.service.ls())

const ipfsAddOptions = {
  cidVersion: 1,
  hashAlg: 'sha2-256'
}
const numNFTs = 2 //1000

console.log("Load all metas from file into memory...")
let files = []
let results = []
for (let i = 0; i < numNFTs; i++) {
    console.log(`Processing image ${i}...`)
    const fname = `./gen-metas/${i}.json`
    const img = fs.readFileSync(fname)
    const fileObj = { path: `/metas/${i}`, content: img }
    files.push(fileObj)
}

console.log("Adding all of the files to IPFS...")
let rootCID;
for await (const res of ipfs.addAll(files, ipfsAddOptions)) {
    if (res.path == 'metas') {
        rootCID = res.cid.toString()
    }
    console.log(res)
    console.log("Pinning...")
    console.log(await ipfs.pin.remote.add(res.cid, { service: 'pinata' }))
}

process.exit()
