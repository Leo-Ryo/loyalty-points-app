/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pastel-blue': '#E3EFFF',
                'pastel-peri': '#C3DDFF',
                'pastel-pink': '#FAC6D0',
                'pastel-salmon': '#FB93A3',
                'pastel-mint-light': '#EAF7F2',
                'pastel-mint': '#D3F2DD',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.04)',
                'glass-nav': '0 8px 32px rgba(0, 0, 0, 0.08)',
                'glass-hover': '0 20px 40px rgba(0, 0, 0, 0.08)',
                'salmon': '0 8px 16px rgba(251, 147, 163, 0.3)'
            }
        },
    },
    plugins: [],
}
