import "./styles.scss";

interface ChatMessageProps {
  content: string;
  isFromServer?: boolean;
}

//Componente para cada mensagem do chat
export function ChatMessage({
  content, //Conteúdo da mensagem
  isFromServer = false, //Variável que indica se a mensagem é do servidor
}: ChatMessageProps) {
  return (
    <div className={`chat-message-container ${isFromServer ? "server" : ""}`}>
      <span>{content}</span>
    </div>
  );
}
