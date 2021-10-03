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
    const fname = `./images/${i}.png`
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

// Update all of the metadatas
for (let i = 0; i < numNFTs; i++) {
    let meta = JSON.parse(fs.readFileSync(`./metas/${i}.json`, 'utf-8'))
    meta.image = `ipfs://${rootCID}/${i}`

    let updatedMeta = JSON.stringify(meta);
    fs.writeFileSync(`./gen-metas/${i}.json`, updatedMeta);
}


process.exit()
