
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>INTELLIPATH AI | Smart Learning Path</title>
    <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
        },
      },
    };
  </script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@100;200;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #030303;
            color: #d4d4d8;
            font-family: 'Inter', sans-serif;
            margin: 0;
            -webkit-tap-highlight-color: transparent;
            height: 100%;
            width: 100%;
        }

        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); opacity: 0.2; }
            50% { transform: translate(50px, -50px) scale(1.1); opacity: 0.3; }
            100% { transform: translate(0px, 0px) scale(1); opacity: 0.2; }
        }
        .animate-blob {
            animation: blob 25s infinite alternate ease-in-out;
        }

        @keyframes scan {
            0% { top: -20%; }
            100% { top: 120%; }
        }

        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.4; }
            100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }

        input, textarea { caret-color: #fbff00; }
        
        html {
            height: 100%;
            width: 100%;
            background: #030303;
        }

        #root {
            height: 100%;
            width: 100%;
        }

        ::selection {
            background: #fbff00;
            color: #000;
        }

        /* Custom Scrollbar for better UI feel if needed */
        .custom-scroll::-webkit-scrollbar {
            width: 3px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(251, 255, 0, 0.1);
            border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(251, 255, 0, 0.3);
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "@google/genai": "https://esm.sh/@google/genai@^1.35.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
</body>
</html>
