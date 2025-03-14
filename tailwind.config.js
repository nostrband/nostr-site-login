/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.ts'],
  theme: {
    extend: {
      animation: {
        popup: 'popup 0.15s',
        fadein: 'fadein 0.15s ease',
      },
      keyframes: {
        slideInBlurredTop: {
          '0%': {
            transform: 'translate(-50%,-200%)',
            transformOrigin: '50% 0%',
            filter: 'blur(40px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translate(-50%, -50%)',
            transformOrigin: '50% 50%',
            filter: 'blur(0)',
            opacity: '1',
          },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        slideOut: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.98)',
          },
        },
      },
      animation: {
        'slide-in-blurred-top': 'slideInBlurredTop 0.2s cubic-bezier(0.785, 0.135, 0.150, 0.860) both',
        'slide-in': 'slideIn 0.3s forwards',
        'slide-out': 'slideOut 0.3s forwards',
      },
    },
  },
  plugins: [],
}
