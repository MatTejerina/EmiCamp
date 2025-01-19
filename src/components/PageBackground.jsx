const PageBackground = () => {
  return (
    <>
      <div className="fixed top-[-50px] left-[-50px] w-96 h-96 bg-[#f1e6fe] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="fixed top-0 right-[-50px] w-96 h-96 bg-[#fde6f6] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-[-50px] left-[30%] w-96 h-96 bg-[#e6f0fe] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
    </>
  );
};

export default PageBackground; 