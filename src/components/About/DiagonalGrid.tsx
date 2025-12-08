export const DiagonalGrid = () => {
  const cards = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="absolute right-0 top-0 w-[70%] h-full overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 origin-center"
        style={{ transform: 'rotate(-45deg) translate(20%, -10%)' }}
      >
        <div className="grid grid-cols-5 gap-4 w-[150%] h-[200%]">
          {cards.map((i) => (
            <div
              key={i}
              className="w-32 h-44 bg-muted/60 rounded-3xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
