"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalQRIS({ pkg, onClose }: { pkg: any, onClose: () => void }) {
  const [status, setStatus] = useState<"loading" | "waiting_payment" | "success">("loading");

  useEffect(() => {
    // Simulate fetching QRIS from Midtrans
    const timer = setTimeout(() => {
      setStatus("waiting_payment");
    }, 1500);

    // Auto-success after 5 seconds (simulating webhook for demo)
    const successTimer = setTimeout(() => {
      setStatus("success");
    }, 6500);

    return () => {
      clearTimeout(timer);
      clearTimeout(successTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(26,42,74,0.4)] backdrop-blur-sm">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {status === "loading" && (
            <div className="p-10 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand-coral)]" />
              <p className="text-[var(--color-brand-navy)] font-medium">Membuat QRIS...</p>
            </div>
          )}

          {status === "waiting_payment" && (
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-full bg-[var(--color-brand-navy)] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm">
                QRIS Pembayaran
              </div>
              
              <div className="p-4 border-4 border-[var(--color-brand-coral)] rounded-2xl bg-white shadow-lg relative">
                {/* Dummy QR Code UI */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-xl relative overflow-hidden">
                   <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2">
                     {Array.from({length: 36}).map((_, i) => (
                       <div key={i} className={`bg-gray-800 rounded-sm ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`} />
                     ))}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-lg z-10 font-bold text-[var(--color-brand-navy)] text-xs shadow-md">QRIS</div>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl text-[var(--color-brand-navy)]">{pkg.name}</h3>
                <p className="text-[var(--color-brand-coral)] font-extrabold text-2xl mt-1">{pkg.price}</p>
                <p className="text-sm opacity-60 mt-2">Scan dengan aplikasi M-Banking atau E-Wallet (Gopay, OVO, Dana)</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="p-10 flex flex-col items-center text-center space-y-6 bg-[var(--color-brand-cream)]">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-brand-navy)]">Pembayaran Berhasil!</h3>
                <p className="text-[var(--color-brand-navy)] opacity-70 mt-2">
                  Koin telah ditambahkan ke akunmu.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-[var(--color-brand-navy)] hover:bg-[#121d33] transition-all"
              >
                Kembali ke Toko
              </button>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
