"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users,
  Calendar,
  Clock,
  Radio,
} from "lucide-react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hls from "hls.js";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [data, setData] = useState<any>();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const interval = async () => {
    if (!sessionId) return;
    console.log("[LOGGER] Sending ping...");
    return ws?.send(
      JSON.stringify({
        op: "PING",
        d: {
          session: sessionId,
        },
        t: new Date().getTime(),
      })
    );
  };

  useEffect(() => {
    console.log(sessionId)
    const newInterval = setInterval(() => {
      interval();
    }, 4000);
    setIntervalRef(newInterval);
  }, [sessionId]);

  function startWS() {
    const wss = new WebSocket("ws://localhost:5001");
    wss.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { d, t, op } = data;
      switch (data.op) {
        case "HANDSHAKE":
          setSessionId(d.session);
          console.log("[LOGGER] Handshake received, session ID:", d.session);
          break;
        case "PONG":
          console.log("[LOGGGER] Pong received");
          break;
        case "HELLO":
          console.log("[LOGGER] Hello received");
          if (d) {
            setData(d);
            setIsLive(true);
            startVideo();
          }
          setLoading(false);
          break;
        case "STREAM_UPDATE":
          console.log("[LOGGER] Live updated");
          setIsLive(true);
          setData(d);
          break;
        case "STREAM_START":
          console.log("[LOGGER] Live started");
          window.location.reload();
          break;
        case "STREAM_END":
          console.log("[LOGGER] Live ended");
          setIsLive(false);
          setData(d);
          break;
        case "RE_HANDSHAKE":
          setSessionId(null);
          wss.send(
            JSON.stringify({
              op: "HANDSHAKE",
              d: null,
              t: new Date().getTime(),
            })
          );
          break;
      }
    };
    wss.onopen = () => {
      setWs(wss);
      wss.send(
        JSON.stringify({ op: "HANDSHAKE", d: null, t: new Date().getTime() })
      );
    };
  }

  const startVideo = async () => {
    const video = videoRef.current;
    console.log("[LOGGER] Starting video stream...");
    //console.log(isLive)
    //if (!isLive) return console.log("[LOGGER] Not live, skipping video start");
    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource("https://api.stream.zljxl.xyz/hls/index.m3u8");
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "https://api.stream.zljxl.xyz/hls/index.m3u8";
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      }
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      var res = await fetch("https://api.stream.zljxl.xyz/stream/current");
      const data = await res.json();
      if (res.status == 200) {
        setIsLive(true);
        startVideo()
      } else if (res.status == 206) {
        setIsLive(false);
        setData(data.last);
      }
      startWS();
    }

    init();
  }, []);

  function formatNumber(num: number) {
    if (num === 0) return "0";
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(num);
  }

  return (
    <>
      {loading && (
        <div className="absolute w-full h-full flex items-center justify-center auto bg-black/40 z-10">
          <div className="flex flex-col w-[30%] h-[30%] items-center justify-center space-y-4 bg-white rounded-xl">
            <Radio className="w-16 h-16 animate-spin text-blue-600" />
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
              <p className="text-gray-600">
                Aguarde enquanto o vídeo é carregado.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <Header live={isLive} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative aspect-video bg-slate-900">
                  <video
                    autoPlay
                    muted={true}
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls
                  />
                  {data && isLive ? (
                    <>
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>AO VIVO</span>
                      </div>

                      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{formatNumber(data.viewers)} assistindo</span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {data ? data.title : "Carregando..."}
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Discussão e votação de projetos de lei municipal, prestação
                    de contas do executivo e outras matérias de interesse
                    público.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {data
                          ? new Date(data.date).toLocaleDateString("pt-br")
                          : "Carregando..."}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {data
                          ? new Date(data.start_time).toLocaleTimeString(
                              "pt-br",
                              {
                                second: undefined,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Carregando..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Ordem do Dia
                </h3>
                {data ? (
                  <div className="space-y-3">
                    {data.agenda && data.agenda.length > 0 ? (
                      <>
                        {data.agenda.map((item: any, index: number) => (
                          <div
                            className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                            key={index}
                          >
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">
                                {item.title || "Projeto Municipal"}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {item.description ||
                                  "Discussão e votação do projeto unicipal."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-bold">Nada por aqui...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p>Nada por aqui...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Status da Sessão
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Estado:</span>
                    {isLive ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Em Andamento
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Encerrada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Início:</span>
                    <span className="text-slate-900 font-medium">
                      {data ? (
                        new Date(data.start_time).toLocaleTimeString("pt-br", {
                          second: undefined,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Final:</span>
                    <span className="text-slate-900 font-medium">15:45</span>
                  </div>
                </div>
              </div>

              {/* Mesa Diretora */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Mesa Diretora
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900">Presidente</h4>
                    <p className="text-sm text-slate-600">
                      Erimar da Silva Lesqueves
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Vice-Presidente
                    </h4>
                    <p className="text-sm text-slate-600">Anderson Pedreiro</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      1º Secretário
                    </h4>
                    <p className="text-sm text-slate-600">
                      Jorginho de Lagoa Dantas
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Próximas Sessões
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-slate-900">
                      Sessão Extraordinária
                    </p>
                    <p className="text-sm text-slate-600">
                      22 de Janeiro - 15:00
                    </p>
                  </div>
                  <div className="border-l-4 border-gray-300 pl-3">
                    <p className="font-medium text-slate-900">
                      Sessão Ordinária
                    </p>
                    <p className="text-sm text-slate-600">
                      29 de Janeiro - 14:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <div className="space-y-2 text-sm">
                  <p>📞 (28) 3532-6418</p>
                  <p>✉️ controladoria@marataizes.es.gov.br</p>
                  <p>📍 Av. Rubens Rangel nº 411</p>
                  <p className="opacity-90">
                    Cidade Nova, Marataízes/ES - CEP: 29345-000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
