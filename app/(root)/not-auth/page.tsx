import { InfoBlock } from "@/components/shared";

export default function UnauthorizedPage() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center px-4 sm:mt-10 md:mt-24">
      <InfoBlock
        title="Unauthorized"
        text="This page can only be viewed by authorized users"
        imageUrl="/assets/lock.png"
      />
    </div>
  );
}
