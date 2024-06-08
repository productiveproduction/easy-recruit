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
  Code,
} from "@nextui-org/react";

export default function CandidateModal({ candidate }: any) {
  const {
    name,
    role,
    email,
    phone,
    company,
    reason,
    score,
    summary,
    transcript,
    status,
  } = candidate;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");

  React.useEffect(() => {
    setBackdrop("blur");
  }, [isOpen]);

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        View
      </Button>
      <Modal
        backdrop={backdrop as "opaque" | "blur" | "transparent" | undefined}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="min-w-[600px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>{name}</h1>
                <h4 className="text-small">{role}</h4>
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4 justify-between items-start">
                  <div>
                    <p className="text-small">
                      <span className="font-bold">Phone: </span>
                      {phone}
                    </p>
                    <p className="text-small">
                      <span className="font-bold">Email: </span>
                      {email}
                    </p>
                    <p className="text-small">
                      <span className="font-bold">Current company: </span>
                      {company}
                    </p>
                  </div>
                  <div className="">
                    <Code
                      color="success"
                      className="max-w-[80px] p-2 mt-4 text-center"
                    >
                      <span className="text-small">Score {score} </span>
                    </Code>
                  </div>
                </div>

                <h4 className="font-bold pt-6">Scoring Justification</h4>
                <p>{reason}</p>
                {summary && (
                  <>
                    <Code
                      color="success"
                      className="max-w-[80px] p-2 mt-4 text-center ml-auto"
                    >
                      <span className="text-small">{status}</span>
                    </Code>
                    <div className="bg-gray-100 mt-6 p-4 rounded-md">
                      <h4 className="font-bold">Call summary</h4>
                      {transcript.split("\n").map((line: string, i: number) => (
                        <p className="text-small" key={i}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </>
                )}
                {!summary && (
                  <Textarea
                    label={`If you believe ${name} is suitable for the job, please provide the call details and any other relevant information.`}
                    labelPlacement="outside"
                    placeholder="Details of the call. E.g. confirm candidate's availability, salary expectations, etc."
                    className="w-full pt-8"
                    minRows={10}
                  />
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {!summary && (
                  <Button color="primary" onPress={onClose}>
                    Call
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
