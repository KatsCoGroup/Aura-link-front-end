import { DiagonalGrid } from "./DiagonalGrid";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-24 overflow-hidden">
      {/* Diagonal Card Grid Background */}
      <DiagonalGrid />

      {/* Content */}
      <div className="relative z-10 px-8 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6">
          WHO WE ARE
        </h1>
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          KatsCo is a digital-first brand built at the intersection of finance, technology, 
          and culture. What began as a Web3 initiative has grown into a community of 
          builders empowering people to learn, create, and participate in the future of 
          digital finance. From blockchain education to NFT creation and tools for small 
          businesses, KatsCo is shaping accessible pathways into the next era of Web3.
        </p>
      </div>
    </section>
  );
};
