/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                ocean: {
                    950: '#102B49',
                    900: '#1D3A60', // Deep Ocean
                    800: '#075B9A', // Ocean Blue
                    700: '#0877B8',
                    600: '#0E8CC7',
                    500: '#169FD6',
                    400: '#3EA8C7',
                    200: '#BDEBF5',
                    100: '#EAF6FA',
                    50: '#F5FBFD',
                },
                water: {
                    600: '#3EA8C7',
                    500: '#5BBEDB', // Clear Water
                    400: '#7CD0E5',
                    300: '#9BDDEB', // Mist Aqua
                    200: '#BDEBF5',
                    100: '#EAF6FA',
                    50: '#F5FBFD',
                },
                mist: {
                    50: '#F5FBFD',
                    100: '#EAF6FA',
                    200: '#D8EEF4',
                    300: '#C2E4ED',
                },
                seafoam: {
                    50: '#F3FAF8',
                    100: '#E7F4F1',
                    200: '#D0EBE5',
                    500: '#23856D',
                },
                status: {
                    success: '#23856D',
                    warning: '#C58A2A',
                    danger: '#C4515B',
                    info: '#1686B8',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
            },
            boxShadow: {
                'soft': '0 8px 24px rgba(16, 43, 73, 0.07)',
                'pop': '0 14px 36px rgba(16, 43, 73, 0.13)',
                'ocean': '0 8px 24px rgba(7, 91, 154, 0.18)',
                'glow': '0 0 20px rgba(91, 190, 219, 0.25)',
            }
        },
    },
    plugins: [],
};
