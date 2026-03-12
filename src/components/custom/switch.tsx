import { MouseEventHandler } from "react";

interface Props {
  enabled: boolean;
  toggleHandler: MouseEventHandler<HTMLDivElement>;
}

export function Switch({ enabled, toggleHandler }: Props) {
  return (
    <div
      onClick={toggleHandler}
      className={`relative flex h-9 w-20 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-primary-600" : "bg-gray-300"
      }`}
    >
      <span
        className="h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"
        style={{ transform: enabled ? "translateX(2.75rem)" : "translateX(0)" }}
      />
    </div>
  );
}
