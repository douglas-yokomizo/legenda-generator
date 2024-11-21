"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import frasesAvaliacao from "../data/frases_avaliacoes.json";
import frasesCompra from "../data/frases_compra.json";
import frasesDisponibilidade from "../data/frases_disponibilidade.json";
import frasesDomingo from "../data/frases_domingo.json";
import frasesEndereco from "../data/frases_endereco.json";
import frasesHorarios from "../data/frases_horarios.json";
import frasesPixCredito from "../data/frases_pix_credito.json";

const Home = () => {
  const [temaEvento, setTemaEvento] = useState("");
  const [funcionaDomingo, setFuncionaDomingo] = useState(false);
  const [possuiEstacionamento, setPossuiEstacionamento] = useState(false);
  const [infoEstacionamento, setInfoEstacionamento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState(false);
  const [detalhesPontoReferencia, setDetalhesPontoReferencia] = useState("");
  const [quantidadeLegendas, setQuantidadeLegendas] = useState(1);
  const [captions, setCaptions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [horarioSemanaAbertura, setHorarioSemanaAbertura] = useState("");
  const [horarioSemanaFechamento, setHorarioSemanaFechamento] = useState("");
  const [horarioSabadoAbertura, setHorarioSabadoAbertura] = useState("");
  const [horarioSabadoFechamento, setHorarioSabadoFechamento] = useState("");
  const [horarioDomingoAbertura, setHorarioDomingoAbertura] = useState("");
  const [horarioDomingoFechamento, setHorarioDomingoFechamento] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!temaEvento) newErrors.temaEvento = "Este campo é obrigatório";
    if (!horarioSemanaAbertura || !horarioSemanaFechamento)
      newErrors.horarioSemana = "Estes campos são obrigatórios";
    if (!horarioSabadoAbertura || !horarioSabadoFechamento)
      newErrors.horarioSabado = "Estes campos são obrigatórios";
    if (
      funcionaDomingo &&
      (!horarioDomingoAbertura || !horarioDomingoFechamento)
    )
      newErrors.horarioDomingo = "Estes campos são obrigatórios";
    if (!endereco) newErrors.endereco = "Este campo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCaptions = () => {
    if (!validateFields()) return;
    setLoading(true);
    setTimeout(() => {
      const newCaptions = Array.from({ length: quantidadeLegendas }, () =>
        createCaption()
      );
      setCaptions(newCaptions);
      setLoading(false);
      setShowModal(true);
    }, 1000);
  };

  const createCaption = () => {
    const captionParts = [
      temaEvento,
      randomItem(frasesHorarios.frases)
        .replace(
          "{horario_semana}",
          `${horarioSemanaAbertura} às ${horarioSemanaFechamento}`
        )
        .replace(
          "{horario_sabado}",
          `${horarioSabadoAbertura} às ${horarioSabadoFechamento}`
        ),
      funcionaDomingo
        ? randomItem(frasesDomingo.frases).replace(
            "{horario_domingo}",
            `${horarioDomingoAbertura} às ${horarioDomingoFechamento}`
          )
        : "",
      "Estamos comprando 👇",
      randomItem(frasesCompra.frases),
      randomItem(frasesPixCredito.frases),
      randomItem(frasesAvaliacao.frases),
      randomItem(frasesDisponibilidade.frases),
      randomItem(frasesEndereco.frases).replace("{endereco}", endereco),
      possuiEstacionamento ? `Estacionamento: ${infoEstacionamento}` : "",
      pontoReferencia ? `Ponto de referência: ${detalhesPontoReferencia}` : "",
    ];

    return captionParts.filter(Boolean).join("\n\n");
  };

  const randomItem = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleNext = () => {
    setCurrentCaptionIndex((prevIndex) =>
      prevIndex === captions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentCaptionIndex((prevIndex) =>
      prevIndex === 0 ? captions.length - 1 : prevIndex - 1
    );
  };

  const handleTimeInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).showPicker();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(captions[currentCaptionIndex]);
    toast.success("Legenda copiada no clipboard!");
  };

  const exportToTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([captions[currentCaptionIndex]], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `legenda_${currentCaptionIndex + 1}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const exportAllToTxt = () => {
    const allCaptions = captions.join("\n\n---\n\n");
    const element = document.createElement("a");
    const file = new Blob([allCaptions], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "todas_legendas.txt";
    document.body.appendChild(element);
    element.click();
  };

  const showCaptions = () => {
    setShowModal(true);
  };

  return (
    <motion.div
      className="container mx-auto p-4 bg-yellow-50 min-h-screen rounded-lg shadow-xl border-MARROM border-4 max-w-full sm:max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-MARROM text-center sm:text-left">
        Gerador de Legendas
      </h1>
      <div className="mb-6">
        <label
          htmlFor="temaEvento"
          className="block text-lg font-medium text-MARROM"
        >
          Tema do evento
        </label>
        <input
          id="temaEvento"
          type="text"
          value={temaEvento}
          onChange={(e) => setTemaEvento(e.target.value)}
          className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:outline-none"
        />
        {errors.temaEvento && (
          <p className="text-red-500 text-sm mt-1">{errors.temaEvento}</p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-MARROM">
          Horário de funcionamento (Seg - Sex)
        </label>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <input
            id="horarioSemanaAbertura"
            type="time"
            value={horarioSemanaAbertura}
            onChange={(e) => setHorarioSemanaAbertura(e.target.value)}
            className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
            onClick={handleTimeInputClick}
          />
          <input
            id="horarioSemanaFechamento"
            type="time"
            value={horarioSemanaFechamento}
            onChange={(e) => setHorarioSemanaFechamento(e.target.value)}
            className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
            onClick={handleTimeInputClick}
          />
        </div>
        {errors.horarioSemana && (
          <p className="text-red-500 text-sm mt-1">{errors.horarioSemana}</p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-MARROM">
          Horário de funcionamento (Sábado)
        </label>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <input
            id="horarioSabadoAbertura"
            type="time"
            value={horarioSabadoAbertura}
            onChange={(e) => setHorarioSabadoAbertura(e.target.value)}
            className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
            onClick={handleTimeInputClick}
          />
          <input
            id="horarioSabadoFechamento"
            type="time"
            value={horarioSabadoFechamento}
            onChange={(e) => setHorarioSabadoFechamento(e.target.value)}
            className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
            onClick={handleTimeInputClick}
          />
        </div>
        {errors.horarioSabado && (
          <p className="text-red-500 text-sm mt-1">{errors.horarioSabado}</p>
        )}
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/2">
          <label className="flex items-center text-lg font-medium text-MARROM">
            Funciona aos domingos?
            <input
              type="checkbox"
              checked={funcionaDomingo}
              onChange={(e) => setFuncionaDomingo(e.target.checked)}
              className="ml-2 h-4 w-4 rounded border-gray-300 text-MARROM focus:ring-yellow-500"
            />
          </label>
          <AnimatePresence>
            {funcionaDomingo && (
              <motion.div
                className="mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-lg font-medium text-MARROM">
                  Horário de funcionamento (Domingo)
                </label>
                <div className="flex flex-col sm:flex-row sm:space-x-2">
                  <input
                    id="horarioDomingoAbertura"
                    type="time"
                    value={horarioDomingoAbertura}
                    onChange={(e) => setHorarioDomingoAbertura(e.target.value)}
                    className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
                    onClick={handleTimeInputClick}
                  />
                  <input
                    id="horarioDomingoFechamento"
                    type="time"
                    value={horarioDomingoFechamento}
                    onChange={(e) =>
                      setHorarioDomingoFechamento(e.target.value)
                    }
                    className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
                    onClick={handleTimeInputClick}
                  />
                </div>
                {errors.horarioDomingo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.horarioDomingo}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="flex items-center text-lg font-medium text-MARROM">
            Possui estacionamento?
            <input
              type="checkbox"
              checked={possuiEstacionamento}
              onChange={(e) => setPossuiEstacionamento(e.target.checked)}
              className="ml-2 h-4 w-4 rounded border-gray-300 text-MARROM focus:ring-yellow-500"
            />
          </label>
          <AnimatePresence>
            {possuiEstacionamento && (
              <motion.div
                className="mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="infoEstacionamento"
                  className="block text-lg font-medium text-MARROM"
                >
                  Informações sobre o estacionamento
                </label>
                <input
                  id="infoEstacionamento"
                  type="text"
                  value={infoEstacionamento}
                  onChange={(e) => setInfoEstacionamento(e.target.value)}
                  className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 pb-[2px] focus:ring-0"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="endereco"
          className="block text-lg font-medium text-MARROM"
        >
          Endereço da loja
        </label>
        <input
          id="endereco"
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
        />
        {errors.endereco && (
          <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
        )}
      </div>
      <div className="mb-6">
        <label className="flex items-center text-lg font-medium text-MARROM">
          Ponto de referência?
          <input
            type="checkbox"
            checked={pontoReferencia}
            onChange={(e) => setPontoReferencia(e.target.checked)}
            className="ml-2 h-4 w-4 rounded border-gray-300 text-MARROM focus:ring-yellow-500"
          />
        </label>
        <AnimatePresence>
          {pontoReferencia && (
            <motion.div
              className="mt-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="detalhesPontoReferencia"
                className="block text-lg font-medium text-MARROM"
              >
                Detalhes do ponto de referência
              </label>
              <input
                id="detalhesPontoReferencia"
                type="text"
                value={detalhesPontoReferencia}
                onChange={(e) => setDetalhesPontoReferencia(e.target.value)}
                className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mb-6">
        <label
          htmlFor="quantidadeLegendas"
          className="block text-lg font-medium text-MARROM"
        >
          Quantidade de legendas
        </label>
        <input
          id="quantidadeLegendas"
          type="number"
          min="1"
          value={quantidadeLegendas}
          onChange={(e) => setQuantidadeLegendas(Number(e.target.value))}
          className="mt-1 block w-full bg-transparent border-b-2 border-MARROM focus:border-yellow-800 focus:ring-0"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between ">
        <motion.button
          onClick={generateCaptions}
          className="bg-MARROM text-white text-lg px-6 py-4 rounded mb-4 sm:mb-0 sm:mr-2 hover:bg-yellow-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Gerar Legendas
        </motion.button>
        <motion.button
          onClick={showCaptions}
          className={`px-6 py-4 rounded text-lg ${
            captions.length === 0
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-LARANJA text-white hover:bg-AMARELO"
          }`}
          disabled={captions.length === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Mostrar Legendas
        </motion.button>
      </div>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-10 shadow-lg max-w-3xl w-full h-4/5 overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center relative mb-4">
                <motion.button
                  className="text-2xl text-red-600 absolute -top-4 -right-6"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  X
                </motion.button>
                <h2 className="text-lg font-bold mb-2 text-MARROM">
                  Legenda {currentCaptionIndex + 1} de {captions.length}
                </h2>
              </div>
              <pre className="whitespace-pre-wrap mb-4 text-MARROM">
                {captions[currentCaptionIndex]}
              </pre>
              <div className="flex justify-between pt-4">
                <motion.button
                  onClick={copyToClipboard}
                  className="bg-MARROM text-white px-4 py-2 rounded mb-4 mr-2 hover:bg-yellow-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Copiar Legenda
                </motion.button>
                <motion.button
                  onClick={exportToTxt}
                  className="bg-LARANJA text-white px-4 py-2 rounded mb-4 mr-2 hover:bg-AMARELO"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Exportar para TXT
                </motion.button>
                <motion.button
                  onClick={exportAllToTxt}
                  className="bg-LARANJA text-white px-4 py-2 rounded mb-4 hover:bg-AMARELO"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Exportar Todas para TXT
                </motion.button>
              </div>
              {captions.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className={`absolute left-6 top-1/2 transform text-xl pb-3 -translate-y-1/2 ${
                      currentCaptionIndex === 0
                        ? "bg-gray-400 cursor-not-allowed hover:bg-gray-600"
                        : "bg-MARROM hover:bg-yellow-700 hover:transition-transform hover:scale-110"
                    } p-2 rounded-full`}
                    disabled={currentCaptionIndex === 0}
                  >
                    &larr;
                  </button>
                  <button
                    onClick={handleNext}
                    className={`absolute right-6 top-1/2 transform text-xl pb-3 -translate-y-1/2 ${
                      currentCaptionIndex === captions.length - 1
                        ? "bg-gray-400 cursor-not-allowed hover:bg-gray-600"
                        : "bg-MARROM hover:bg-yellow-700 hover:transition-transform hover:scale-110"
                    } p-2 rounded-full`}
                    disabled={currentCaptionIndex === captions.length - 1}
                  >
                    &rarr;
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </motion.div>
  );
};

export default Home;
