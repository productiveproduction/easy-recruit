export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center">
      <div className="inline-block w-full justify-center">{children}</div>
    </section>
  );
}
