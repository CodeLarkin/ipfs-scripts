# IPFS Uploading and Pinning Utility for NFT collections


## Install

```
npm install
```


## Setup

1. Add all of your NFT images to `./images/` and name them `0.png`, `1.png`, etc....
2. Update `numNFTs` in `upload-images.js` and `upload-metas.js`
3. Add all of your NFT metadata files (without IPFS image URIs filled in) to `./metas/` and name `0.json`, `1.json`, etc....
4. Set `PINATA_JWT` variable in your environment
    * For one-time setup, add `export PINATA_JWT=<your-pinata-jwt>` to your `~/.bashrc` and then just this once: `source ~/.bashrc`
5. `node service-add.js`


## Upload and Pin Image and Metadata to IPFS

```
node upload-images.js
# Now check that `gen-metas/` was populated and looks correct. Then:
node upload-metas.js
```
