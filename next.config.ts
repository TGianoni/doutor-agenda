/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Isso impede que o Next crie múltiplos processos que se perdem no Windows
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
