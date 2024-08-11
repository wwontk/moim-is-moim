interface InnerConProps {
  children: React.ReactNode;
}

const InnerCon = ({ children }: InnerConProps) => (
  <section className="w-[1000px] m-auto">{children}</section>
);

export default InnerCon;
