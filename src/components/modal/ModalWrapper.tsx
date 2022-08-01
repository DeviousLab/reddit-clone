import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

type ModalWrapperProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  open,
  onClose,
}) => {
  return (
    <>
      <Modal isOpen={open} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent width={{ base: "sm", md: "xl" }}>{children}</ModalContent>
      </Modal>
    </>
  );
};
export default ModalWrapper;