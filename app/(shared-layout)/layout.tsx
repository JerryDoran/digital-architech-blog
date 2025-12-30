import { Navbar } from '@/components/shared/navbar';

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
