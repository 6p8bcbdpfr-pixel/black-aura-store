/* ─── ProductImage ─── */
/* Renders an uploaded image (base64) or a gradient placeholder */

export function isUploadedImage(value) {
  return typeof value === 'string' && value.startsWith('data:image')
}

export default function ProductImage({
  src,
  alt = '',
  aspect = 'aspect-[3/4]',
  padding = false,
  rounded = '',
}) {
  if (isUploadedImage(src)) {
    return (
      <div className={`${aspect} overflow-hidden ${rounded}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          // Improve rendering quality on retina
          style={{ imageRendering: 'auto' }}
        />
      </div>
    )
  }

  // Gradient placeholder
  const gradient = src || 'from-zinc-800 to-zinc-900'
  return (
    <div
      className={`${aspect} bg-gradient-to-br ${gradient} flex items-center justify-center ${padding ? 'p-6' : ''} ${rounded}`}
    >
      <div className="w-full h-full rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
        <svg
          className="w-12 h-12 text-soft-grey/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
      </div>
    </div>
  )
}
