export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-hairline-strong) border-t-(--color-signal)"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
