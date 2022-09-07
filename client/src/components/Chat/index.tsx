import axios from "axios";
import { PaperPlaneTilt } from "phosphor-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChatMessage } from "../ChatMessage";
import { PossibleAnswerButton } from "../PossibleAnswerButton";
import "./styles.scss";

type ChatMessage = {
  messages: string[];
  possibleAnswers: string[];
  isFromServer: boolean;
  isAnswered: boolean;
};

type CustomError = {
  response: {
    data: {
      detail: string;
    };
  };
};

//Componente que cria o chat na tela
export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]); //Vetor com as mensagens que serão exibidas no chat
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1); //Índice da mensagem atual
  const [serverMessagesCount, setServerMessagesCount] = useState(0); //Contador de mensagens do servidor
  const [userMessage, setUserMessage] = useState(""); //Mensagem que o usuário digita no input
  const [chatData, setChatData] = useState<{
    //Dados que serão enviados para o servidor
    matricula: string | number;
    materia: number;
    nota: number;
  }>({
    matricula: "",
    materia: -1,
    nota: -1,
  });
  const ref = useRef<HTMLDivElement>(null); //Referência para o elemento div que contém as mensagens

  //Função que pega a mensagem inicial do servidor
  async function fetchInitialMessage() {
    const res = await axios.get<{
      messages: string[];
      possible_answers: string[];
    }>(`http://0.0.0.0:7999/chatbot`);

    const newMessage: ChatMessage = {
      ...res.data,
      possibleAnswers: res.data.possible_answers,
      isFromServer: true,
      isAnswered: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setServerMessagesCount((prev) => prev + 1);
  }

  //Função que pega a mensagem do servidor após o usuário enviar uma mensagem
  async function fetchMessages() {
    try {
      const { materia, matricula, nota } = chatData;
      const url = `http://0.0.0.0:7999/chatbot/${serverMessagesCount}?`;
      const customParams = new URLSearchParams();

      materia !== -1 && customParams.append("materia", materia.toString());
      matricula !== "" &&
        customParams.append("matricula", matricula.toString());
      nota !== -1 && customParams.append("nota", nota.toString());

      const res = await axios.post<{
        id: number;
        messages: string[];
        possible_answers: string[];
      }>(url + customParams);

      const newMessage: ChatMessage = {
        ...res.data,
        possibleAnswers: res.data.possible_answers,
        isFromServer: true,
        isAnswered: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setServerMessagesCount((prev) => prev + 1);
    } catch (err) {
      const error = err as CustomError;

      if (error.response.data.detail) {
        const newMessage: ChatMessage = {
          messages: [error.response.data.detail],
          possibleAnswers: [],
          isFromServer: true,
          isAnswered: false,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    }
  }

  //Função que envia a mensagem do usuário para o chat
  function handleSendMessage(message: string, index?: number) {
    if (message.trim() == "") {
      return;
    }

    const newMessage: ChatMessage = {
      messages: [message],
      possibleAnswers: [],
      isFromServer: false,
      isAnswered: false,
    };

    const currentMessage = messages[currentMessageIndex];
    const newMessages = [...messages];

    currentMessage.isAnswered = true;
    newMessages[currentMessageIndex] = currentMessage;

    setMessages([...newMessages, newMessage]);
    setUserMessage("");
    handleAnswerServer(message, index);
  }

  //Função que envia a resposta do usuário para o servidor dependendo da mensagem atual
  function handleAnswerServer(message: string, index?: number) {
    switch (serverMessagesCount) {
      case 1:
        setChatData({
          ...chatData,
          matricula: message.match(/^\d+$/) ? parseInt(message) : message,
        });
        break;
      case 2:
        setChatData({ ...chatData, materia: index || 0 });
        break;
      case 3:
        setChatData({ ...chatData, nota: index || 0 });
        break;
    }
  }

  //Chama a função para pegar a mensagem inicial do servidor
  useEffect(() => {
    if (serverMessagesCount === 0) {
      fetchInitialMessage();
    }
  }, []);

  //Chama a função para pegar a mensagem do servidor após o usuário enviar uma mensagem
  useEffect(() => {
    if (serverMessagesCount > 0) {
      fetchMessages();
    }
  }, [chatData]);

  //Função que rola a tela para baixo quando uma nova mensagem é enviada
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight;
    }
    messages.length > 0 && setCurrentMessageIndex((prev) => prev + 1);
  }, [messages]);

  //Parte visual do chat
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <img src="/robot_image.svg" alt="Robot" />
        </div>
        <h1>Chat C115</h1>
      </div>
      <div ref={ref} className="chat-display">
        {messages.map((item, index) => (
          <Fragment key={index}>
            {item?.messages.map((mes) => (
              <ChatMessage
                key={mes}
                content={mes}
                isFromServer={item.isFromServer}
              />
            ))}
            <div
              key={item.messages[0].trim()}
              className={`possible-answers-wrapper ${
                item.isAnswered ? "question-answered" : ""
              }`}
            >
              {item?.possibleAnswers.map((mes, index) => (
                <PossibleAnswerButton
                  key={mes}
                  handleSendMessage={handleSendMessage}
                  content={mes}
                  messageIndex={index}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="chat-footer">
        <input
          disabled={
            messages.length > 0
              ? messages[currentMessageIndex]?.possibleAnswers.length > 0
              : false
          }
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Escreva sua mensagem..."
          className="chat-box-input"
        />

        <button
          onClick={() => handleSendMessage(userMessage)}
          className="chat-box-button"
        >
          <PaperPlaneTilt size={20} />
        </button>
      </div>
    </div>
  );
}
