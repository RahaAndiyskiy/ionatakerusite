'use client';

import useHoverTone from '@/hooks/useHoverTone';

interface Props {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export default function CustomButtonAbout({
  label = 'ABOUT',
  href = '#about',
  onClick,
}: Props) {
  const playHoverTone = useHoverTone('/sounds/hover 1.wav');
  const playClickTone = useHoverTone('/sounds/Click 1.wav');

  const handleClick = () => {
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onPointerDown={playClickTone}
      onMouseEnter={playHoverTone}
      onMouseLeave={playHoverTone}
      className="group inline-flex h-10 items-center overflow-hidden text-xs font-kiona tracking-[0.2em] uppercase border border-current hover:border-current active:-translate-y-[0.5px] active:scale-[0.99] active:border-current transition-all duration-[200ms] px-6 relative w-auto"
      style={{ color: '#6B1E23' }}
    >
      <span className="absolute left-6 transition-transform duration-[400ms] ease-in-out group-hover:-translate-x-[400%]" aria-hidden="true">
        ←
      </span>
      <span className="transition-transform duration-[400ms] ease-in-out group-hover:-translate-x-[1.8em]">
        {label}
      </span>
      <span className="absolute right-6 transition-transform duration-[400ms] ease-in-out translate-x-[400%] group-hover:translate-x-0" aria-hidden="true">
        ←
      </span>
    </a>
  );
}
