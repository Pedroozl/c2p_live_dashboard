"use client"

import { useEffect, useState } from "react"
import { UserContext } from "@/context/UserContext"

import LoadingComponent from "@/components/loading-page"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const redirect = (url: string) => {
    return
    if (typeof window !== "undefined") {
      window.location.href = url
    }
  }

  useEffect(() => {
    async function a() {
      setUser({
        name: "teste",
        avatar: "",
        surname: "teste",
        email: "teste@teste.com",
        permissions: [],
      })
      if (
        window.location.pathname.endsWith("/login") ||
        window.location.pathname.endsWith("/login/2fa") ||
        window.location.pathname.endsWith("/auth/password-reset") ||
        window.location.pathname.endsWith("/oauth/authorize")
      ) {
        return setLoading(false)
      }
      var token = localStorage.getItem("token")
      if (!token) {
        return redirect(
          "https://oauth.c2p.tech/oauth2/authorize?client_id=9223372036854775807&redirect_uri=http://localhost:3002/oauth/authorize&response_type=code"
        )
      }
      var res = await fetch("https://api.oauth.c2p.tech/users/@me", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(token),
        },
      })
      if (res.status == 428) {
        return redirect("/auth/password-reset")
      } else if (res.status != 200) {
        return redirect(
          "https://oauth.c2p.tech/oauth2/authorize?client_id=9223372036854775807&redirect_uri=http://localhost:3002/oauth/authorize&response_type=code"
        )
      }
      var data = await res.json()
      setLoading(false)
    }
    a()
  }, [])
  return (
    <>
      <UserContext.Provider value={{ user: user }}>
        {loading ? <LoadingComponent /> : children}
      </UserContext.Provider>
    </>
  )
}
