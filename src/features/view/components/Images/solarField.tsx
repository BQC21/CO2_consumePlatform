export function SolarField() {
    return (
        <svg className="absolute right-0 bottom-0 h-2/3 w-full" viewBox="0 0 600 320" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 8 }).map((__, col) => (
            <g key={`${row}-${col}`} transform={`translate(${40 + col * 68}, ${40 + row * 48}) skewX(-18)`}>
                <rect width="58" height="34" rx="2" fill="#16324a" stroke="#8fd0ff" strokeWidth="1" />
                <path d="M0 11h58M0 22h58M19 0v34M39 0v34" stroke="#8fd0ff" strokeWidth="0.6" />
            </g>
            )),
        )}
        </svg>
    );
}