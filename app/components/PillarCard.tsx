import Link from 'next/link';
import Image from 'next/image';

interface PillarCardProps {
  id?: string;
  title: string;
  description: string;
  href: string;
  image: string;
  external?: boolean;
  footnote?: string;
}

export default function PillarCard({
  id,
  title,
  description,
  href,
  image,
  external = false,
  footnote,
}: PillarCardProps) {
  const cardContent = (
    <div
      id={id}
      className="bg-warm-white rounded-2xl overflow-hidden border border-border cursor-pointer flex flex-col h-full"
    >
      {/* Photo area */}
      <div className="relative aspect-video">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Title + description at bottom */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-[22px] sm:text-[24px] text-text-primary">
            {title}
          </h3>
          <svg className="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <p className="text-text-secondary text-sm mt-1">{description}</p>
        {footnote && (
          <p className="text-xs text-gold-bright font-medium mt-2">{footnote}</p>
        )}
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    );
  }

  return <Link href={href}>{cardContent}</Link>;
}
