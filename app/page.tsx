import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mt-10">
      <div className="inline-block max-w-xlg text-center justify-center">
        <h1 className={title()}>Find the&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>right candidate&nbsp;</h1>
        <br />
        <h1 className={title()}> 10x faster</h1>
        <h2 className={subtitle({ class: "mt-4" })}></h2>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/start"}
        >
          Let's get started
        </Link>
      </div>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
