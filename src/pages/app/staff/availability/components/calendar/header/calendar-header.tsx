export default function CalendarHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-b bg-background">
      <div className=" py-3">
        {/* 3-column toolbar */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
