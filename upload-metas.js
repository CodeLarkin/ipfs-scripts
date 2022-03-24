import { create } from 'ipfs-http-client';

import fs from 'fs';


const ipfs = create();

(async () => {

    console.log("Available services:")
    console.log(await ipfs.pin.remote.service.ls())

    const ipfsAddOptions = {
      cidVersion: 0,
      hashAlg: 'sha2-256'
    }
    const numNFTs = 8888  //8888

    console.log("Load all metas from file into memory...")
    let files = []
    let results = []
    for (let i = 1; i <= numNFTs; i++) {
        console.log(`Processing image ${i}...`)
        const fname = `./gen-metas/${i}.json`
        const img = fs.readFileSync(fname)
        const fileObj = { path: `/metas/${i}`, content: img }
        files.push(fileObj)
    }

    let j = 1
    console.log("Adding all of the files to IPFS...")
    let rootCID;
    for await (const res of ipfs.addAll(files, ipfsAddOptions)) {
        //console.log(`Processing ${j}`)
        j++
        if (res.path == 'metas') {
            rootCID = res.cid.toString()
            console.log("ROOT: " + rootCID)
        }
        console.log(`Async pinning: '${res.cid.toString()}'...`)
        try {
            let pinResult = await ipfs.pin.remote.add(res.cid, { service: 'pinata' })
            console.log(pinResult)
        } catch {
            console.log("FAIL: possibly already pinned!")
        }
    }

    console.log(`ipfs://${rootCID}`)


    process.exit()

})();
