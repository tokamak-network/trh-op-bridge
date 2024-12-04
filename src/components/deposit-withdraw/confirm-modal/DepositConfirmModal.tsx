"use client";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@chakra-ui/react";
import { CloseIconComponent } from "../../icons/Close";
import { useAtom } from "jotai";
import { jotaiBridgeTransactionInfo } from "@/jotai/bridge";
import { NetworkInfoComponent } from "./NetworkInfoComponent";
import { TransactionDetailComponent } from "./TransactionDetailComponent";
import { DepositButtonComponent } from "../DepositButton";

export const DepositConfirmModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClick: () => Promise<void>;
  isLoading: boolean;
}> = ({ isOpen, setIsOpen, onClick, isLoading }) => {
  const [transaction] = useAtom(jotaiBridgeTransactionInfo);
  return (
    <DialogRoot
      open={isOpen}
      placement={"center"}
      onEscapeKeyDown={() => setIsOpen(false)}
      onInteractOutside={() => setIsOpen(false)}
      onExitComplete={() => setIsOpen(false)}
      onFocusOutside={() => setIsOpen(false)}
    >
      <DialogTrigger></DialogTrigger>
      <DialogContent
        width={"420px"}
        bgColor={"#101217"}
        padding={"24px"}
        borderRadius={"22px"}
        border={"1px solid #25282F"}
        gap={"12px"}
      >
        <DialogHeader>
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Confirm Deposit
            </Text>
            <Button
              bgColor={"transparent"}
              boxSizing={"content-box"}
              justifyContent={"flex-end"}
              width={"24px"}
              height={"24px"}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <CloseIconComponent />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <DialogBody display={"flex"} flexDir={"column"} gap={"8px"}>
          <NetworkInfoComponent
            mode={transaction.mode}
            fromNetwork={transaction.fromChain.name}
            toNetwork={transaction.toChain.name}
          />
          <TransactionDetailComponent transaction={transaction} />
        </DialogBody>
        <DialogFooter>
          <DepositButtonComponent
            height={"48px"}
            onClick={onClick}
            isLoading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};