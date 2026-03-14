import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import clsx from "clsx";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "rounded-3xl bg-card/80 border border-purple-600/20 shadow-xl shadow-purple-900/40",
      className,
    )}
    {...props}
  />
);

export const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-purple-900/40 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed",
      className,
    )}
    type={props.type ?? "button"}
    {...props}
  />
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
        className,
      )}
      {...props}
    />
  ),
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  HTMLAttributes<HTMLTextAreaElement> & {
    rows?: number;
  }
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      "w-full rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
      className,
    )}
    {...props}
  />
));

