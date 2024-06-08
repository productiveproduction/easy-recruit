import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";

export default function CallModal({ children }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {children ? (
        children
      ) : (
        <Button color="primary" onPress={onOpen}>
          Contact Candidates
        </Button>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                What information would you like to share or ask the candidate?
              </ModalHeader>
              <ModalBody>
                <p></p>
                <Textarea
                  label="Please provide the details of the call and any other relevant information."
                  labelPlacement="outside"
                  placeholder="Details of the call. E.g. confirm candidate's availability, salary expectations, etc."
                  className="w-full"
                  minRows={10}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Call
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
