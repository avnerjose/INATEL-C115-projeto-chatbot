import "./styles.scss";

interface PossibleAnswerButtonProps {
  content: string;
  messageIndex: number;
  handleSendMessage: (message: string, index?: number) => void;
}

//Componente para listar possíveis respostas para uma pergunta do servidor
export function PossibleAnswerButton({
  content,
  messageIndex,
  handleSendMessage,
}: PossibleAnswerButtonProps) {
  return (
    <button
      onClick={() => handleSendMessage(content, messageIndex)}
      className="possible-answer-container"
    >
      {content}
    </button>
  );
}
