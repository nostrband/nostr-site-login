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
      },
      animation: {
        'slide-in-blurred-top': 'slideInBlurredTop 0.2s cubic-bezier(0.785, 0.135, 0.150, 0.860) both',
      },
    },
  },
  plugins: [],
}
