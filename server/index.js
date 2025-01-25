const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const PROTO_PATH = "./quest_search.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questSearchProto = grpc.loadPackageDefinition(packageDefinition).questsearch;

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function searchQuestionsByTitle(call, callback) {
  const titleQuery = call.request.title;
  const page = call.request.page || 1;
  const pageSize = call.request.pageSize || 10;

  try {
    await client.connect();
    const database = client.db("speakx");
    const questions = database.collection("questions");

    const query = { title: { $regex: titleQuery, $options: "i" } };
    const totalCount = await questions.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const cursor = questions
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const results = await cursor.toArray();

    const response = {
      questions: results.map((question) => ({
        id: question._id.toString(),
        type: question.type,
        anagramType: question.anagramType || "",
        blocks: question.blocks?.map(block => ({
          text: block.text,
          showInOption: block.showInOption,
          isAnswer: block.isAnswer
        })) || [],
        siblingId: question.siblingId ? question.siblingId.toString() : null,
        solution: question.solution || "",
        title: question.title,
        options: question.options?.map(option => ({
          text: option.text,
          isCorrectAnswer: option.isCorrectAnswer
        })) || [],
      })),
      totalCount: totalCount,
      totalPages: totalPages,
    };

    callback(null, response);
  } catch (error) {
    console.error("Error searching questions by title:", error);
    callback({
      code: grpc.status.INTERNAL,
      details: "Internal server error",
    });
  } finally {
    await client.close();
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(questSearchProto.QuestSearch.service, { SearchQuestionsByTitle: searchQuestionsByTitle });

  const maxMessageSize = 100 * 1024 * 1024;
  const serverOptions = {
    "grpc.max_receive_message_length": maxMessageSize,
    "grpc.max_send_message_length": maxMessageSize,
  };

  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error("Error starting server:", error);
      return;
    }
    console.log(`Server running at http://0.0.0.0:${port}`);
    server.start();
  });
}

main();