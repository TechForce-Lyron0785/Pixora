import { Sparkles } from 'lucide-react'
import React from 'react'

const FooterCompact = () => {
  return (
    <div className="px-6 md:px-10 py-6 border-t border-white/10 mt-8 bg-zinc-950">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-400">Pixora</span>
        </div>

        <div className="flex gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Terms</button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Help</button>
        </div>
      </div>
    </div>
  )
}

export default FooterCompact