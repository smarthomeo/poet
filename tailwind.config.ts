import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        //Color Palette
  			background: 'hsl(240, 6.1%, 97.1%)', // Light Gray
  			foreground: 'hsl(0, 0%, 3.9%)',
  			card: {
  				DEFAULT: 'hsl(240, 6.1%, 97.1%)',// Light Gray
  				foreground: 'hsl(0, 0%, 3.9%)'
  			},
  			popover: {
  				DEFAULT: 'hsl(0, 0%, 100%)',
  				foreground: 'hsl(0, 0%, 3.9%)'
  			},
  			primary: {
  				DEFAULT: 'hsl(262.5, 66.7%, 85.3%)',// Soft Lavender
  				foreground: 'hsl(240, 5.9%, 10%)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(240, 6.1%, 97.1%)',// Light Gray
  				foreground: 'hsl(0, 0%, 9%)'
  			},
  			muted: {
  				DEFAULT: 'hsl(0, 0%, 96.1%)',
  				foreground: 'hsl(0, 0%, 45.1%)'
  			},
  			accent: {
  				DEFAULT: 'hsl(180, 100%, 25%)',// Teal
  				foreground: 'hsl(0, 0%, 98%)'
  			},
  			destructive: {
  				DEFAULT: 'hsl(0, 84.2%, 60.2%)',
  				foreground: 'hsl(0, 0%, 98%)'
  			},
  			border: 'hsl(0, 0%, 89.8%)',
  			input: 'hsl(0, 0%, 89.8%)',
  			ring: 'hsl(0, 0%, 3.9%)',
  			chart: {
  				'1': 'hsl(12, 76%, 61%)',
  				'2': 'hsl(173, 58%, 39%)',
  				'3': 'hsl(197, 37%, 24%)',
  				'4': 'hsl(43, 74%, 66%)',
  				'5': 'hsl(27, 87%, 67%)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(0, 0%, 98%)',
  				foreground: 'hsl(240, 5.3%, 26.1%)',
  				primary: 'hsl(240, 5.9%, 10%)',
  				'primary-foreground': 'hsl(0, 0%, 98%)',
  				accent: 'hsl(240, 4.8%, 95.9%)',
  				'accent-foreground': 'hsl(240, 5.9%, 10%)',
  				border: 'hsl(220, 13%, 91%)',
  				ring: 'hsl(217.2, 91.2%, 59.8%)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

    