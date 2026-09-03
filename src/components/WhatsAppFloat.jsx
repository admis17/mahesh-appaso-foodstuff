import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../data/company'

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hello, I'd like to enquire about your rice.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" fill="white" strokeWidth={0} />
    </a>
  )
}
