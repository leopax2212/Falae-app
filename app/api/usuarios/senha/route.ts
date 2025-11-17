export async function PUT(request: Request) {
  try {
    const data = await request.json()

    const response = await fetch("http://localhost:8081/bff/usuarios/senha", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ message: errorText || "Senha atual incorreta" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const responseData = await response.json()
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] API Route Error:", error)
    return new Response(JSON.stringify({ message: "Falha ao alterar senha" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
