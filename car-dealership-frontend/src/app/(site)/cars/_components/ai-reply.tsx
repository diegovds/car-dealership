'use client'

import { useEffect, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'car-ai-reply'

interface AiReplyProps {
  // string = nova busca, undefined = paginação (ler storage), null = limpar
  reply: string | null | undefined
}

export function AiReply({ reply }: AiReplyProps) {
  // Atualiza o sessionStorage como efeito colateral — sem setState
  useEffect(() => {
    if (reply === null) {
      sessionStorage.removeItem(STORAGE_KEY)
    } else if (reply !== undefined) {
      sessionStorage.setItem(STORAGE_KEY, reply)
    }
  }, [reply])

  // Lê o sessionStorage de forma SSR-safe (null no servidor, valor real no cliente)
  const storedReply = useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(STORAGE_KEY),
    () => null,
  )

  const displayReply = reply !== undefined ? reply : storedReply

  if (!displayReply) return null

  return (
    <div className="enter-left text-muted-foreground border-l-2 border-amber-400 pl-4 text-sm italic">
      {displayReply}
    </div>
  )
}
