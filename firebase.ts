{
  "entities": {
    "ChatMessage": {
      "title": "ChatMessage",
      "description": "A message in a chat conversation",
      "type": "object",
      "properties": {
        "role": {
          "type": "string",
          "enum": [
            "user",
            "model"
          ]
        },
        "content": {
          "type": "string"
        },
        "image": {
          "type": "string"
        },
        "userId": {
          "type": "string"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "role",
        "content",
        "userId",
        "createdAt"
      ]
    },
    "Analysis": {
      "title": "Analysis",
      "description": "An image analysis result",
      "type": "object",
      "properties": {
        "image": { "type": "string" },
        "result": { "type": "string" },
        "userId": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      },
      "required": ["image", "result", "userId", "createdAt"]
    }
  },
  "firestore": {
    "/chats/{chatId}": {
      "schema": "ChatMessage",
      "description": "Collection of chat messages"
    },
    "/analyses/{analysisId}": {
      "schema": "Analysis",
      "description": "Collection of image analyses"
    }
  }
}
