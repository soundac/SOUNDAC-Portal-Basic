import { SoundacAccountHistory } from './soundac-account-history';
import { SoundacKeys } from './soundac-keys';

export class SoundacAccount {

    constructor() {
        this.keys = new SoundacKeys();
        this.history = [];
        this.witnessVotes = [];
    }

    Soundacbalance: string;
    Vestbalance: string;
    MBDbalance: string;
    NextwithDraw: Date;
    keys: SoundacKeys;
    history: SoundacAccountHistory[];
    witnessVotes: string[];

    mapAccount(soundacAccount: any) {
        console.log(soundacAccount); // Object from blockchain - Uncomment to view all properties

        this.keys.basicPubkey = soundacAccount.basic.key_auths[0][0];
        this.keys.activePubkey = soundacAccount.active.key_auths[0][0];
        this.keys.ownerPubkey = soundacAccount.owner.key_auths[0][0];
        this.keys.memoPubkey = soundacAccount.memo_key;
        this.Soundacbalance = soundacAccount.balance.split(' ')[0];
        this.Vestbalance = soundacAccount.vesting_shares.split(' ')[0];
        this.MBDbalance = soundacAccount.mbd_balance.split(' ')[0];
        this.NextwithDraw = new Date(soundacAccount.next_vesting_withdrawal);
        this.witnessVotes = soundacAccount.witness_votes;
    }

}
