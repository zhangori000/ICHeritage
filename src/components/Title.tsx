import { PropsWithChildren } from "react";

export function Title(props: PropsWithChildren) {
  return (
    <h1 className="display max-w-4xl text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
      {props.children}
    </h1>
  );
}
