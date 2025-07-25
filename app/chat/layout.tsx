export default function ChatLayout({ children, panel }: { children: React.ReactNode; panel: React.ReactNode }) {
  return (
    <>
      {panel}
      {children}
    </>
  );
}
