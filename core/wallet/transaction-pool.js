const Transaction = require('./transaction')
const { TRANSACTION_THRESHOLD } = require("../../config")

class TransactionPool {
    constructor() {
        this.transactions = []
    }

    thresholdReached() {
        return this.transactions.length >= TRANSACTION_THRESHOLD
    }

    addTransaction(transaction) {
        this.transactions.push(transaction)
        return this.transactions
    }

    validTransactions() {
        return this.transactions.filter(transaction => {
            if (!transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.data.from}`)
                return
            }

            return transaction
        })
    }

    transactionExists(transaction) {
        return this.transactions.find(transaction => transaction.id === transaction.id)
    }

    clear() {
        this.transactions = []
    }
}

module.exports = TransactionPool
