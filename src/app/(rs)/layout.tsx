export default async function RSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='px-2'>{children}</div>
    </div>
  );
}
