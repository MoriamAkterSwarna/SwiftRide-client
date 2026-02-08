import { LoginForm } from "@/components/modules/authentication/LoginForm";
import { motion } from "motion/react";

export default function Login() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-cyan-300 via-emerald-300 to-teal-300 p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl rounded-3xl bg-linear-to-br from-cyan-200 via-emerald-200 to-teal-300 p-6 md:p-8 shadow-2xl"
      >
        <div className="grid min-h-150 md:min-h-175 grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
          {/* Left Panel */} 

           <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center p-6 md:p-10 bg-white"
          >
            <LoginForm className="max-w-sm w-full" />
          </motion.div>

           {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:flex flex-col justify-between bg-linear-to-br from-slate-900 via-indigo-900 to-slate-950 p-8 overflow-hidden"
          >
            {/* Animated Background Blobs */}
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/70 blur-3xl opacity-60 animate-pulse" />
            <div className="absolute left-6 top-8 h-12 w-12 rounded-full bg-blue-400/80 shadow-lg" />
            <div className="absolute left-16 top-24 h-8 w-8 rounded-full bg-blue-300/90" />
            <div className="absolute -left-4 bottom-12 h-24 w-24 rounded-full bg-cyan-400/70 blur-2xl opacity-50" />
            <div className="absolute right-6 top-12 h-14 w-14 rounded-full bg-cyan-400/85 shadow-lg" />
            <div className="absolute right-2 top-32 h-10 w-10 rounded-full bg-cyan-300/80" />
            <div className="absolute right-4 bottom-24 h-20 w-20 rounded-full bg-emerald-500/75 blur-2xl opacity-60" />
            <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-400/60 blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 mb-8 border border-white/20"
              >
                <span className="text-xs font-bold tracking-widest text-white">
                  🚀 SWIFTRIDE
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Welcome Back!
                </h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
                  Jump back into the action and continue your journey with SwiftRide. Fast, safe, and reliable rides at your fingertips.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: "⚡", text: "Lightning-fast pickups" },
                    { icon: "🛡️", text: "Verified & trusted drivers" },
                    { icon: "🌍", text: "Available 24/7" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-white/90 text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative z-10 pt-8 border-t border-white/10"
            >
              <p className="text-white/70 text-sm mb-2">New to SwiftRide?</p>
              <a
                href="/register"
                className="text-white font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-2 group"
              >
                Create an account
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          </motion.div>

         
         
        </div>
      </motion.div>
    </div>
  );
}