let Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const publicKeyToAddress = require('ethereum-public-key-to-address');
const secp256k1 = require('secp256k1');

let web3 = new Web3(new Web3.providers.HttpProvider("http://trailsblockrpc1.kkservice.cc:8502"));

var SerialPort = require('serialport');
// var delay = require('delay');

// let CriticalEvent = {
//     "vin": "aji0922",
//     "longitude": "24.25",
//     "latitude": "124.25",
//     "deviceId": "d001",
//     "timestamp": "1622480521",
//     "speed": 20,
//     "acceleratorPos": 10,
//     "breakingPos": 10,
//     "PRNDL": "P",
//     "travelDirection": "",
//     "steeringWheelPos": 20,
//     "tirePressureLF": 36,
//     "tirePressureRF": 36,
//     "tirePressureLR": 36,
//     "tirePressureRR": 36,
//     "status": {},
//     "acceleration": "(1,0,0)",
//     "note": "",
// }

class CEDP {
    constructor(abi, address) {
        this.abi = abi;
        console.log(address.toString('hex'))
        this.address = address.replace(/['"]+/g, '');
    }
    signData(CE) {
        return new Promise((resolve, reject) => {
            var contract = new web3.eth.Contract(this.abi);
            let to = this.address;

            //設定serial port
            // var port = new SerialPort('/dev/ttyACM0', {
                var port = new SerialPort('COM3', {
                baudRate: 115200
            });
            // console.log(port);
            let buff = '';
            let tx;
            let signedData = '';
            let hashedTx;
            let publicKey = '';
            let chainId = 27596;
            var r = "0x";
            var s = "0x";
            var v;

            port.on('open', function () {
                console.log('--- CEDP: COM opened ---')
                //送出取得公鑰指令
                port.write('$H_#', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('--- CEDP: write command on TH:', '$H_#  ---');
                });
                port.on('data', async function (data) {
                    buff += data.toString();
                    if (buff.match(/#/ig) == null) { }
                    //公鑰取得並設定tx
                    else if (buff.match(/#/ig).length >= 1 && publicKey == '') {
                        // buff = 'reset';
                        let start = buff.search(/\$4_/) + 3;
                        publicKey = buff.substring(start, start + 128);
                        // console.log('publicKey:', publicKey);
                        //公鑰推導地址
                        let account = publicKeyToAddress('04' + publicKey);
                        // console.log("Addr:", account);
                        await web3.eth.getTransactionCount(account).then(txCount => {
                            let newNonce = web3.utils.toHex(txCount);
                            web3.eth.getGasPrice().then(async (gasPrice) => {
                                // console.log(JSON.stringify(CE));
                                const sdata = contract.methods.writeData(JSON.stringify(CE)).encodeABI(function (error, result) {
                                    if (!error)
                                        console.log(result);
                                    else
                                        console.error(error)
                                });
                                // console.log("  encoded ABI:", sdata)

                                //產生tx
                                let txParams = {
                                    nonce: newNonce,
                                    gasPrice: parseInt(gasPrice),
                                    gas: 2000000,
                                    from: account,
                                    to: to,
                                    // value: '0xDE0B6B3A7640000',
                                    data: sdata,
                                }
                                console.log("  txParams:", txParams);


                                const customCommon = Common.forCustomChain(
                                    'mainnet',
                                    {
                                        chainId: chainId,
                                        networkId: chainId,
                                    },
                                    'petersburg',
                                )

                                tx = new EthereumTx(txParams, { common: customCommon })
                                //rlp+hash tx
                                hashedTx = tx.hash(false);
                                // console.log('hashedTx:', hashedTx.toString('hex'));
                                //設定signData
                                // await delay(500);
                                buff = '';
                                port.write('$2_' + hashedTx.toString('hex').substring(0, 32) + '#', function (err) {
                                    if (err) {
                                        return console.log('Error on write: ', err.message);
                                    }
                                    console.log('--- CEDP: write command on TH:', '$2_' + hashedTx.toString('hex').substring(0, 32) + '#  ---');
                                });
                                // await delay(500);
                                // port.write('$2_' + hashedTx.toString('hex').substring(32, 64) + '#', function (err) {
                                //     if (err) {
                                //         return console.log('Error on write: ', err.message);
                                //     }
                                //     console.log('--- CEDP: write command on TH:', '$2_' + hashedTx.toString('hex').substring(32, 64) + '#  ---');
                                // });
                                // port.write('$0_#', function (err) {
                                //     if (err) {
                                //         return console.log('Error on write: ', err.message);
                                //     }
                                //     console.log('message written on COM:', '$0_#');
                                // });
                            })
                        })
                    }
                    else if (buff.match(/\$6_I#/ig) != null && buff.match(/\$6_D#/ig) ==null && buff.match(/\$6_7#/ig) ==null) {
                        //執行sign指令
                        buff = '';
                        port.write('$2_' + hashedTx.toString('hex').substring(32, 64) + '#', function (err) {
                            if (err) {
                                return console.log('Error on write: ', err.message);
                            }
                            console.log('--- CEDP: write command on TH:', '$2_' + hashedTx.toString('hex').substring(32, 64) + '#  ---');
                        });
                    }
                    else if (buff.match(/\$6_D#/ig) != null) {
                        //執行sign指令
                        buff = '';
                        port.write('$0_#', function (err) {
                            if (err) {
                                return console.log('Error on write: ', err.message);
                            }
                            console.log('--- CEDP: write command on TH:', '$0_#  ---');
                        });
                    }
                    //簽章
                    else if (buff.match(/#/ig).length >= 5) {
                        // console.log('---buff---');
                        // console.log(buff);
                        // console.log('---buff---');
                        let start = buff.search(/\$3_/) + 3;
                        signedData = buff.substring(start, start + 128);
                        // console.log('signedData:', signedData);

                        r += signedData.substring(0, 64);
                        s += signedData.substring(64, 128);
                        v = chainId * 2 + 35;

                        //確認v值
                        let recoverPubkey = Buffer.from(secp256k1.ecdsaRecover(Buffer.from(signedData, "hex"), 1, hashedTx, false)).toString('hex')
                        if (recoverPubkey == '04' + publicKey.toLowerCase())
                            v += 1

                        tx.r = r;
                        tx.s = s;
                        tx.v = v;

                        // console.log('Senders Address: ' + tx.getSenderAddress().toString('hex'))

                        let raw = tx.serialize().toString('hex');
                        // console.log('raw:', raw)

                        // web3.eth.sendSignedTransaction('0x' + raw).on('receipt', console.log);

                        port.close(function () {
                            console.log('--- CEDP: COM closed ---');
                        });
                        console.log('--- CEDP: sign data by TH ---');
                        resolve(raw);
                    }
                })
            })
        });
    }
}

module.exports = CEDP;