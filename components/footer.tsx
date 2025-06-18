import { Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-lg font-semibold">Câmara Municipal</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Acompanhe as sessões da Câmara Municipal e participe ativamente da
              democracia local.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  target="_blank"
                  href="https://www.marataizes.es.gov.br/transparencia"
                  className="hover:text-white transition-colors"
                >
                  Portal da Transparência
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://marataizes.camarasempapel.com.br/spl/consulta-producao.aspx?tipo=7"
                  className="hover:text-white transition-colors"
                >
                  Projetos de Lei
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://marataizes.camarasempapel.com.br/legislacao/"
                  className="hover:text-white transition-colors"
                >
                  Legislação Municipal
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.marataizes.es.gov.br/e-ouv"
                  className="hover:text-white transition-colors"
                >
                  Ouvidoria
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="/manage"
                  className="hover:text-white transition-colors"
                >
                  Acesso Tnterno
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Horário de Funcionamento</h4>
            <div className="text-sm text-slate-400 space-y-1">
              <p>Segunda a Sexta: 8h às 17h</p>
              <p>Sessões: Terças, 14h</p>
              <p>Atendimento ao Público:</p>
              <p>Segunda a Quinta, 9h às 16h</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} C2P. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
