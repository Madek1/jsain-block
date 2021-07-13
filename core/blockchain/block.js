const SHA256 = require('crypto-js/sha256')
const moment = require('moment')
const ChainUtil = require('../../chain-util')

class Block {
    constructor(timestamp, data, hash, lastHash, validator, signature) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.validator = validator
        this.signature = signature
    }

    toString() {
        return `Block
            Timestamp:  ${this.timestamp}
            Data:       ${this.data}
            Validator     : ${this.validator}
            Signature: ${this.signature}
            Hash:       ${this.hash}
            Last hash:  ${this.lastHash}`
    }

    static genesis() {
        return new this(moment().unix(), [], '0', '0')
    }

    static createBlock(lastBlock, _data, wallet) {
        let hash
        let timestamp  = moment().unix()
        const lastHash = lastBlock.hash
        let data = []
        data.push(_data)
        hash = Block.hash(timestamp, lastHash, data)
        let validator = wallet.getPublicKey()
        let signature = Block.signBlockHash(hash, wallet)
        return new this(timestamp, lastHash, hash, data, validator, signature)
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(JSON.stringify(`${timestamp}${lastHash}${data}`)).toString()
    }

    static blockHash(block) {
        const { timestamp, lastHash, data } = block
        return Block.hash(timestamp, lastHash, data)
    }

    static signBlockHash(hash, wallet) {
        return wallet.sign(hash)
    }

    static verifyBlock(block) {
        return ChainUtil.verifySignature(
            block.validator,
            block.signature,
            Block.hash(block.timestamp, block.lastHash, block.data)
        )
    }

    static verifyLeader(block, leader) {
        return block.validator === leader
    }
}

module.exports = Block
