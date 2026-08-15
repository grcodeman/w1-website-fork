import Image from 'next/image';

interface PortfolioCardProps {
  name: string;
  image: string;
  url: string;
}

export default function PortfolioCard({ name, image, url }: PortfolioCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-warm-white rounded-2xl overflow-hidden border border-border cursor-pointer"
    >
      <div className="relative aspect-video bg-hover-bg">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h2 className="font-serif text-xl text-text-primary">
          {name}
        </h2>
      </div>
    </a>
  );
}
