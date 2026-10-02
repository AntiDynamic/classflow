import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
export function Mascot({ message, compact = false }: { message: string; compact?: boolean }) { return <motion.div className={`mascot ${compact ? 'mascot-compact' : ''}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}><div className="mascot-face"><span /><span /></div><div className="mascot-bubble"><Sparkles size={13} /> <span>{message}</span></div></motion.div> }
