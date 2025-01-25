import { type NextRequest, NextResponse } from "next/server"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.resolve("./app/api/search/quest_search.proto")

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const questSearchProto = grpc.loadPackageDefinition(packageDefinition).questsearch as any

const maxMessageSize = 100 * 1024 * 1024
const clientOptions = {
  "grpc.max_receive_message_length": maxMessageSize,
  "grpc.max_send_message_length": maxMessageSize,
}

const client = new questSearchProto.QuestSearch(
  process.env.GRPC_SERVER_URL || "localhost:50051",
  grpc.credentials.createInsecure(),
  clientOptions,
)

function searchQuestionsByTitle(title: string, type?: string, page = 1, pageSize = 10): Promise<any> {
  return new Promise((resolve, reject) => {
    client.SearchQuestionsByTitle({ title, type, page, pageSize }, (error: Error | null, response: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get("title") || ""
  const type = searchParams.get("type") || undefined
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)

  try {
    const response = await searchQuestionsByTitle(title, type, page, pageSize)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while searching", details: (error as Error).message }, { status: 500 })
  }
}

