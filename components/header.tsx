import { Radio } from "lucide-react";
import Image from "next/image";

export default function Header(props: { live: boolean }) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <img
              width={250}
              height={100}
              alt="logo"
              src={
                "https://www.cmmarataizes.es.gov.br/assets/img/logo_site.png"
              }
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Câmara Municipal de Marataízes
              </h1>
              <p className="text-sm text-slate-600">Transmissão ao Vivo</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            {props.live ? (
              <>
                <Radio className="w-4 h-4 text-red-500" />
                <span className="font-medium">AO VIVO</span>
              </>
            ) : (
              <>
                <span className="font-medium">OFFLINE</span>
                <Radio className="w-4 h-4 text-red-500" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
