import { useEffect } from "react";
import { useWalletConnect } from "../wallet-connect/useWalletConnect";
import { useAtom } from "jotai";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import { BridgeModeEnum } from "@/types/bridge";
import { l1Chain, l2Chain } from "@/config/network";
import { getTokenInfoByChainId } from "@/utils/token";
import { supportedTokens } from "@/constants/token";
import { getBridgeTokenType } from "@/utils/bridge";

export const useDepositWithdrawInitiate = () => {
  const { isConnected, address } = useWalletConnect();
  const [transaction, setTransaction] = useAtom(jotaiBridgeTransactionInfo);
  useEffect(() => {
    if (transaction.mode === BridgeModeEnum.DEPOSIT) {
      setTransaction((prev) => ({
        ...prev,
        fromChain: l1Chain,
        toChain: l2Chain,
      }));
    } else {
      setTransaction((prev) => ({
        ...prev,
        fromChain: l2Chain,
        toChain: l1Chain,
      }));
    }
    const chainId =
      transaction.mode === BridgeModeEnum.DEPOSIT ? l1Chain.id : l2Chain.id;
    const supportedTokenList = getTokenInfoByChainId(chainId);
    if (supportedTokenList.length === 0) return;
    const token1 = supportedTokenList[0];
    const token2 = supportedTokens.find(
      (t) =>
        t.chainId !== token1.chainId &&
        t.bridgedTokenSymbol === token1.bridgedTokenSymbol
    );
    setTransaction((prev) => ({
      ...prev,
      l1Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token1 : token2,
      l2Token: transaction.mode === BridgeModeEnum.DEPOSIT ? token2 : token1,
    }));
  }, [transaction.mode, setTransaction]);

  useEffect(() => {
    if (!isConnected) return;
    setTransaction((prev) => ({
      ...prev,
      fromAddress: address as `0x${string}`,
      toAddress: address as `0x${string}`,
    }));
  }, [isConnected, address, setTransaction]);

  useEffect(() => {
    if (!transaction.l1Token || !transaction.l2Token) return;
    const bridgeTokenType = getBridgeTokenType(
      transaction.l1Token,
      transaction.l2Token
    );
    setTransaction((prev) => ({ ...prev, bridgeTokenType }));
  }, [transaction.l1Token, transaction.l2Token]);
  return { transaction };
};
