import { SoundacTransaction } from './soundac-transaction';

export class SoundacAccountHistory {

    constructor() { }

    id: string;
    date: Date;
    block: number;
    transaction: SoundacTransaction;

    mapHistory(accountHistory: any) {
        // console.log(accountHistory); // Blockchain Object
        this.id = accountHistory.id;
        this.date = accountHistory.timestamp;
        this.block = accountHistory.block;
        this.transaction = new SoundacTransaction();
        this.transaction.mapTransaction(accountHistory.op);
    }

}
