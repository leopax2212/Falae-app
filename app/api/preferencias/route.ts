export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 🔧 Corrige o problema do usuarioId vazio
    const usuarioId = data.usuarioId || localStorage.getItem("usuarioId") || "1" // substitua por um ID real
    const payload = { ...data, usuarioId }

    const response = await fetch("http://localhost:8081/bff/preferencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: `BFF Error: ${errorText}` }), {
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
    return new Response(JSON.stringify({ error: "Failed to submit preferences" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
