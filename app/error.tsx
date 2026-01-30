"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-center text-red-500">
      Something went wrong.
    </div>
  );
}