"use client"
import { useRouter } from "next/navigation"
import IntroPage from "../../components/IntroPage"

export default function CharactersPage() {
  const router = useRouter()
  return <IntroPage onStartChat={(id) => router.push(id ? `/chat?persona=${id}` : "/chat")} />
}
