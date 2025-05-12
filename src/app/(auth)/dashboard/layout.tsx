export default function DashboardLayout({
  children, // Main dashboard content
  modal, // Intercepted photo route (conditionally rendered)
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      {/* Dashboard Page Stays Visible */}

      {/* photo Appears When Open */}
      <div>{modal}</div>
    </>
  );
}
