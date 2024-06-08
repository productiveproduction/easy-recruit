import { title } from "@/components/primitives";

const endpoint = "https://backend-dev-jbzvblgmza-ts.a.run.app";

export default function BlogPage() {
  const uploadFile = async (file: File) => {
    // upload to endpoint
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${endpoint}/upload?user_id=660016420c2fa4e0368ccb26`,
      {
        method: "POST",
        body: formData,
      }
    );
  };

  const startScreening = async () => {
    // start screening
    const response = await fetch(
      `${endpoint}/screen?user_id=660016420c2fa4e0368ccb26`,
      {
        method: "POST",
        body: JSON.stringify({
          job_description: "Software Engineer",
          core_criteria: "React, Node.js, TypeScript",
        }),
      }
    );
  };

  return (
    <div>
      <h1 className={title()}>Let's start</h1>
    </div>
  );
}
