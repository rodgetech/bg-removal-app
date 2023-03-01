import { creditsAtom } from "@/atoms";
import { useAtomValue } from "jotai";

type Props = {
  showRatio?: boolean;
};

export default function UsageBar({ showRatio = true }: Props) {
  const { used, limit } = useAtomValue(creditsAtom);

  return (
    <div className="flex items-center gap-3">
      <div className="w-full overflow-hidden rounded-full bg-zinc-200/50">
        <div
          className="rounded-full bg-black py-0.5 text-center text-xs font-medium leading-none text-white"
          style={{
            width: `${limit == 0 ? 0 : Math.ceil((used / limit) * 100)}%`,
          }}
        >
          <span className="p-0.5 ">{`${Math.ceil(
            (used / limit) * 100
          )}%`}</span>
        </div>
      </div>
      {showRatio && (
        <div>
          <p className="font-medium">
            {used}/{limit}
          </p>
        </div>
      )}
    </div>
  );
}
