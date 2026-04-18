import { type ComponentPropsWithoutRef } from "react";

export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={["mx-auto w-full max-w-7xl px-6 md:px-8", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

