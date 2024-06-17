"use client";

import { useState } from "react";
import { Button, Textarea } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";
import { useRouter } from "next/navigation";

// const endpoint = "http://localhost:8080";

const endpoint = "https://backend-prod-jbzvblgmza-ts.a.run.app";

export default function BlogPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [coreCriteria, setCoreCriteria] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${endpoint}/upload?user_id=666e2ef3b781a9c55c9ec230`, {
      method: "POST",
      body: formData,
    });
  };

  const startScreening = async () => {
    // Validate inputs
    if (jobDescription.trim() === "" || coreCriteria.trim() === "") {
      alert("Please fill in all fields and upload at least one file.");
      return;
    }

    setLoading(true);
    setProgress(0);

    // Upload files with progress
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
      setProgress((prev) => prev + 100 / files.length);
    }

    // Start screening
    await fetch(`${endpoint}/screen?user_id=666e2ef3b781a9c55c9ec230`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_description: jobDescription,
        key_criteria: coreCriteria,
      }),
    }).then((res) => {
      setLoading(false);
      setProgress(0);
      router.push("/results");
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Let's start!</h1>
      <Textarea
        minRows={8}
        isRequired
        label="Job Description"
        labelPlacement="outside"
        placeholder="Enter the full job description"
        className="pt-8"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <Textarea
        minRows={8}
        isRequired
        label="Core Criteria"
        labelPlacement="outside"
        placeholder={
          "What are your core criteria? \nPlease list the core criteria below to help identify the best candidate for the job mentioned above:\n\nCore criteria can include:\n• Work permit for [country] \n• At least 5 years experience with React.js\n• Hand-coding HTML, CSS, and Vanilla JavaScript\n• WCAG compliance"
        }
        className="pt-8 pb-8"
        value={coreCriteria}
        onChange={(e) => setCoreCriteria(e.target.value)}
      />

      <input
        id="fileId"
        type="file"
        accept=".pdf,.doc,.docx"
        multiple
        onChange={(e: any) => {
          const selectedFiles = Array.from(e.target.files);
          setFiles(selectedFiles as File[]);
        }}
      />

      <Button onClick={startScreening}>Start screening</Button>

      {loading && (
        <Progress
          aria-label="Uploading..."
          size="md"
          value={progress}
          color="success"
          showValueLabel={true}
          className="max-w-md"
        />
      )}
    </div>
  );
}
