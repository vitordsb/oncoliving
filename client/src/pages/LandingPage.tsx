import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Play, Shield, CheckCircle, Star, Quote } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "ONCOLOGIST") {
      navigate("/admin");
    } else if (user.role === "PATIENT") {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleStart = () => {
    if (user) {
      if (user.role === "ONCOLOGIST") navigate("/admin");
      else navigate("/dashboard");
      return;
    }
    navigate("/auth");
  };

  const videoItems = [
    { title: "Apresentação do Movimento para Cura", length: "3:15" },
    { title: "Como usar os treinos educativos", length: "4:02" },
    { title: "Dicas de segurança e sinais de alerta", length: "2:47" },
  ];

  const testimonials = [
    {
      name: "Juliana M.",
      role: "Paciente em quimioterapia",
      quote:
        "Consegui entender quando era seguro me exercitar e ganhei confiança para manter movimento mesmo nos dias mais difíceis.",
    },
    {
      name: "Carla R.",
      role: "Sobrevivente oncológica",
      quote:
        "Os protocolos e alertas me ajudaram a respeitar meus limites e ainda assim evoluir com segurança.",
    },
    {
      name: "Dr. Henrique",
      role: "Oncologista parceiro",
      quote:
        "A abordagem educativa da Andressa facilita a adesão do paciente e mantém a segurança em primeiro lugar.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 text-gray-900">
      <header className="sticky top-0 z-20 border-b border-pink-100/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <p className="text-xs uppercase tracking-wide text-pink-600 font-semibold">
                Movimento para Cura
              </p>
              <p className="text-sm text-gray-700">OncoLiving por Andressa Semionatto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-pink-200 text-pink-700" onClick={handleStart}>
              Já tenho conta
            </Button>
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleStart}>
              Começar agora
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 w-fit">Educação + Segurança</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Exercícios seguros durante o tratamento oncológico, guiados por quem entende.
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              O Movimento para Cura é um programa educativo da onco-personal Andressa Semionatto,
              baseado em evidências e diretrizes internacionais, para ajudar você a decidir se é um bom
              dia para se exercitar e qual atividade escolher.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-pink-500 hover:bg-pink-600 text-lg px-6" onClick={handleStart}>
                Quero começar
              </Button>
              <Button variant="outline" className="border-pink-200 text-pink-700" onClick={handleStart}>
                Criar conta e acessar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-pink-100">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-pink-600">+12 anos</p>
                  <p className="text-sm text-gray-600">Experiência em exercício oncológico</p>
                </CardContent>
              </Card>
              <Card className="border-pink-100">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-pink-600">Metodologia ACSM</p>
                  <p className="text-sm text-gray-600">Baseada em diretrizes e evidências</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-pink-200/40 blur-3xl" />
            <Card className="relative border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-pink-500 to-green-400 p-8 text-white">
                  <p className="text-sm uppercase tracking-wide font-semibold">Sobre a profissional</p>
                  <h2 className="text-3xl font-bold mt-3">Andressa Semionatto</h2>
                  <p className="mt-4 text-base leading-relaxed">
                    Personal trainer oncológica e fundadora da Andressa Business Saúde Fitness e Oncologia.
                    Criou o Movimento para Cura para orientar pacientes em dias seguros e não recomendados, com
                    foco em segurança, autonomia e bem-estar.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge className="bg-white/20 border-white/30 text-white">Onco-personal</Badge>
                    <Badge className="bg-white/20 border-white/30 text-white">Evidências científicas</Badge>
                    <Badge className="bg-white/20 border-white/30 text-white">Cuidado humanizado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Produto e metodologia */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-gray-900">O que você recebe no Movimento para Cura</h3>
            <p className="text-gray-700">
              Conteúdo 100% digital com protocolos, aulas e quizzes diários para orientar a prática segura.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-pink-100">
              <CardContent className="p-5 space-y-3">
                <Shield className="h-6 w-6 text-pink-600" />
                <h4 className="font-semibold text-lg">Protocolos por sintomas</h4>
                <p className="text-sm text-gray-700">
                  Orientações específicas para febre, dor, náusea, tontura e sinais de alerta.
                </p>
              </CardContent>
            </Card>
            <Card className="border-pink-100">
              <CardContent className="p-5 space-y-3">
                <Play className="h-6 w-6 text-pink-600" />
                <h4 className="font-semibold text-lg">Aulas e treinos gravados</h4>
                <p className="text-sm text-gray-700">
                  Vídeos educativos e treinos leves a moderados, separados por fase do tratamento.
                </p>
              </CardContent>
            </Card>
            <Card className="border-pink-100">
              <CardContent className="p-5 space-y-3">
                <CheckCircle className="h-6 w-6 text-pink-600" />
                <h4 className="font-semibold text-lg">Quizzes diários</h4>
                <p className="text-sm text-gray-700">
                  Avalie seu estado do dia, receba recomendações e entenda quando pausar ou progredir.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vídeos e feedbacks */}
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Conheça o programa em vídeos</h3>
            <p className="text-gray-700">
              Entenda a estrutura do Movimento para Cura, veja exemplos de protocolos e como navegar na plataforma.
            </p>
            <div className="space-y-3">
              {videoItems.map((video, idx) => (
                <Card key={idx} className="border-pink-100">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{video.title}</p>
                      <p className="text-sm text-gray-600">Duração: {video.length}</p>
                    </div>
                    <Button variant="outline" className="border-pink-200 text-pink-700">
                      Assistir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Feedbacks de quem já utilizou</h3>
            <p className="text-gray-700">
              Experiências reais de pacientes e profissionais que adotaram a metodologia da Andressa.
            </p>
            <div className="grid gap-3">
              {testimonials.map((item, idx) => (
                <Card key={idx} className="border-pink-100">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-pink-600">
                      <Quote className="h-4 w-4" />
                      <span className="text-sm font-semibold">{item.role}</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">“{item.quote}”</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-pink-600" />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Políticas e termos */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Políticas, termos e garantia</h3>
          <p className="text-gray-700">
            Transparência sobre reembolso, entrega digital, privacidade e termos de serviço do Movimento para Cura.
          </p>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="reembolso">
              <AccordionTrigger>Política de reembolso — 7 dias</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <p>
                  Oferecemos garantia de 7 dias corridos para solicitar reembolso total, conforme o Código de Defesa
                  do Consumidor para produtos digitais. Após este período, o reembolso não é possível, pois o conteúdo
                  (aulas, protocolos, treinos e materiais) já foi entregue integralmente.
                </p>
                <p>
                  Para solicitar, envie e-mail para <strong>andressaoncopersonal@gmail.com</strong> com nome completo,
                  e-mail da compra e motivo.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="entrega">
              <AccordionTrigger>Entrega (produtos digitais)</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <p>
                  Acesso 100% digital, liberado automaticamente após confirmação do pagamento ou enviado ao e-mail
                  cadastrado em até 5 minutos. Não há envio físico.
                </p>
                <p>
                  Se não receber o acesso, verifique spam/lixo eletrônico/“Promoções”. Persistindo, contate
                  <strong> andressaoncopersonal@gmail.com</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacidade">
              <AccordionTrigger>Política de privacidade</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <p>
                  Coletamos apenas dados necessários para processar a compra e liberar o acesso. Não compartilhamos
                  com terceiros, exceto para pagamento, entrega digital ou cumprimento legal.
                </p>
                <p>
                  Você pode solicitar remoção dos dados pelo e-mail{" "}
                  <strong>andressaoncopersonal@gmail.com</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="termos">
              <AccordionTrigger>Termos de serviço</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Acesso individual e intransferível.</li>
                  <li>Proibido divulgar, compartilhar, copiar ou redistribuir o conteúdo.</li>
                  <li>Uso indevido pode resultar em bloqueio sem reembolso.</li>
                  <li>Resultados variam individualmente; não garantimos resultados específicos.</li>
                  <li>Falhas técnicas podem ocorrer; trabalhamos para resolvê-las rapidamente.</li>
                  <li>Ao comprar, você declara ter lido e aceitado estes termos.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="aviso-legal">
              <AccordionTrigger>Aviso legal (Saúde e Oncologia)</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <p>
                  Programa educacional com base em evidências, diretrizes internacionais e experiência clínica da
                  profissional, alinhado às normas ACSM. Não substitui acompanhamento médico, nutricional,
                  psicológico ou fisioterapêutico.
                </p>
                <p>
                  Recomenda-se seguir orientações do oncologista, evitar exercícios com febre, dor intensa, falta de ar
                  ou sintomas incomuns e buscar apoio profissional em caso de dúvidas.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contato">
              <AccordionTrigger>Informações de contato</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-800 space-y-2">
                <p>Andressa Business Saúde Fitness e Oncologia</p>
                <p>
                  📧 E-mail: <strong>andressaoncopersonal@gmail.com</strong>
                </p>
                <p>📍 Atendimento: segunda a sexta, das 9h às 18h | Resposta em até 24h úteis</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA final */}
        <section className="rounded-2xl border border-pink-100 bg-pink-50/70 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">Pronta para cuidar do seu movimento com segurança?</h3>
            <p className="text-gray-700">
              Crie sua conta, responda ao quiz diário e receba recomendações educativas para cada dia.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleStart}>
              Começar agora
            </Button>
            <Button variant="outline" className="border-pink-200 text-pink-700" onClick={handleStart}>
              Fazer login
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
