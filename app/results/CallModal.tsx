import React, { useEffect } from "react";
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

const endpoint = "https://backend-prod-jbzvblgmza-ts.a.run.app";

// const endpoint = "http://localhost:8080";

export default function CallModal({ selectedKeys }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log("Selected keys: ", selectedKeys);

  // useEffect(() => {
  //   console.log("Selected keys: ", selectedKeys);
  // }, [selectedKeys]);

  const [query, setQuery] = React.useState("");

  const callCandidates = () => {
    console.log("Calling candidates...", selectedKeys);

    selectedKeys.forEach((key: any) => {
      fetch(`${endpoint}/call?document_id=${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      }).then((res) => {
        console.log("Candidate called!");
      });
    });

    onOpenChange();
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Call Candidates
      </Button>
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                <Button color="primary" onPress={callCandidates}>
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
