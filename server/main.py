# Este arquivo é responsável por carregar a env
# contendo a string de conexão e executar a API
import uvicorn

from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    uvicorn.run("app.chatbot:app", host="0.0.0.0", port=7999, reload=True)
