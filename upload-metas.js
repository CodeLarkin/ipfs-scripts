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
for (let i = 0; i < numNFTs; i++) {
    console.log(`Processing image ${i}...`)
    const fname = `./gen-metas/${i}.json`
    const img = fs.readFileSync(fname)
    const fileObj = { path: `/metas/${i}`, content: img }
    files.push(fileObj)
}

console.log("Adding all of the files to IPFS...")
let pinPromises = []
for await (const res of ipfs.addAll(files, ipfsAddOptions)) {
    console.log(`Async pinning: '${res.cid.toString()}'...`)
    //console.log(await ipfs.pin.remote.add(res.cid, { service: 'pinata' }))
    pinPromises.push(ipfs.pin.remote.add(res.cid, { service: 'pinata' }))
}

console.log("Awaiting all async pinning promises...")
for (const prom of pinPromises) {
    console.log(await prom)
}

process.exit()
