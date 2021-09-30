//import * as IPFS from 'ipfs-core'
//
//const ipfs = await IPFS.create()
//const { cid } = await ipfs.add('Hello world')
//console.info(cid)
//// QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf

import { create, globSource } from 'ipfs-core'

const ipfs = await create()

await ipfs.pin.remote.service.add('pinata', {
  endpoint: new URL('https://api.pinata.cloud'),
  key: 'your-pinata-key'
})

//options specific to globSource
//const globSourceOptions = {
//  recursive: true
//};
//
////example options to pass to IPFS
const addOptions = {
  pin: true,
  wrapWithDirectory: true,
  timeout: 10000
};

//for await (const file of ipfs.addAll(globSource('./docs', globSourceOptions), addOptions)) {
let results = []
//for await (const res of ipfs.addAll(["0.png", "1.png"])) {
for await (const res of ipfs.addAll(["0.png", "1.png"])) {
  console.log(res)
  results.push[res]
}

process.exit()
