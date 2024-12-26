
import { Connection } from "@solana/web3.js";

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/DZHbnZioln7-ITlLrhFgZZlcSSiP3yan");


const verifyTransaction = async (
  signature: string,
  expectedFromPubkey: string,
  expectedToPubkey: string,
  expectedLamports: number
): Promise<{ status: number; message: any }> => {
    try{
    const transaction = await connection.getTransaction(signature.toString(), {
      maxSupportedTransactionVersion: 1,
    });
    if(!transaction){
      return {
        status: 411,
        message: "Invalid Transaction!",
      };
    }
   // console.log("->",signature,"<-");
    //console.log(transaction?.transaction.message.getAccountKeys().get(0)?.toString()   );
    console.log(transaction?.meta?.postBalances[1] , "<-->",transaction?.meta?.preBalances[1] ,"<-->",expectedLamports)
    if (!((transaction?.meta?.postBalances[1] ?? 0) - (transaction?.meta?.preBalances[1] ?? 0) >=  expectedLamports  )
    ) {
      return {
        status: 411,
        message: "Transaction amount incorrect",
      };
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
      expectedFromPubkey
    ) {
      return {
        status: 411,
        message: "Transaction sent from wrong address",
      };
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
      expectedToPubkey
    ) {
      return {
        status: 411,
        message: "Transaction sent to wrong address",
      };
    }
   
    return {
      status: 200,
      message: "Verified!",
    };
  }catch(err){

    return {
      status: 411,
      message: "Invalid signature!",
    };
  }

};

export default verifyTransaction;