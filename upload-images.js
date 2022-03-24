import { create } from 'ipfs-http-client';

import fs from 'fs';


const ipfs = create();


(async () => {

    console.log("Available services:")
    console.log(await ipfs.pin.remote.service.ls())

    const ipfsAddOptions = {
      cidVersion: 1,
      hashAlg: 'sha2-256'
    }

    const totalNFTs = 8888
    const revealNFTs = 8888

    console.log("Load all images from file into memory...")
    let files = []
    let results = []
    for (let i = 1; i <= revealNFTs; i++) {
        console.log(`Processing image ${i}...`)
        const fname = `./images/${i}.png`
        const img = fs.readFileSync(fname)
        const fileObj = { path: `/images/${i}`, content: img }
        files.push(fileObj)
    }

    if (revealNFTs < totalNFTs) {
        console.log(`Processing default...`)
        const fname = `./images/default.png`
        const img = fs.readFileSync(fname)
        const fileObj = { path: `/images/default`, content: img }
        files.push(fileObj)
    }

    let j = 1
    console.log("Adding all of the files to IPFS and storing off the root CID...")
    let rootCID
    for await (const res of ipfs.addAll(files, ipfsAddOptions)) {
        console.log(`Processing ${j}`)
        j++
        if (res.path == 'images') {
            console.log('Pinning rootCID...')
            rootCID = res.cid.toString()
        }
        if (res.path == 'images') {
        console.log(`Async pinning: '${res.cid.toString()}'...`)
        try {
            let pinResult = await ipfs.pin.remote.add(res.cid, { service: 'pinata' })
            console.log(pinResult)
        } catch {
            console.log("FAIL: possibly already pinned!")
        }
        }
    }

    console.log("Updating all metadata files and writing to ./gen-metas/ ...")
    for (let i = 1; i <= totalNFTs; i++) {
        let fname = i;
        if (i > revealNFTs) {
            fname = "default"
        }
        let meta = JSON.parse(fs.readFileSync(`./metas/${fname}.json`, 'utf-8'))
        meta.image = `ipfs://${rootCID}/${fname}`
        meta.name = `#${i}`
        meta.edition = `${i}`

        let updatedMeta = JSON.stringify(meta);
        fs.writeFileSync(`./gen-metas/${i}.json`, updatedMeta);
    }

    console.log(`ipfs://${rootCID}`)

    process.exit()

})();
