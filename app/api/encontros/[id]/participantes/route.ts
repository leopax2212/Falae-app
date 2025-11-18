export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const response = await fetch(`http://localhost:8081/bff/encontros/${id}/participantes/${data.usuarioId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    return new Response(JSON.stringify({ error: "Failed to add participant" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
