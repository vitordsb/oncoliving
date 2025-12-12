import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function HistoryPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: history = [], isLoading } = trpc.responses.getMyHistory.useQuery({ limit: 100 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const goodDaysCount = history.filter((r) => r.isGoodDayForExercise).length;
  const totalDays = history.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seu histórico</h1>
            <p className="text-gray-600">
              {goodDaysCount} dias bons de {totalDays} avaliações
            </p>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Importante:</strong> Este histórico mostra suas avaliações de bem-estar e
                recomendações. Consulte sempre seu oncologista para decisões médicas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Avaliações totais</p>
              <p className="text-3xl font-bold text-pink-600">{totalDays}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Dias bons</p>
              <p className="text-3xl font-bold text-green-600">{goodDaysCount}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Taxa de aderência</p>
              <p className="text-3xl font-bold text-purple-600">
                {totalDays > 0 ? Math.round((goodDaysCount / totalDays) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">Nenhuma avaliação ainda. Faça seu primeiro questionário!</p>
              <Button
                onClick={() => navigate("/quiz")}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Fazer questionário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((response) => (
              <Card key={response.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {response.isGoodDayForExercise ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">
                            {format(new Date(response.responseDate), "dd/MM/yyyy")}
                          </p>
                          <span className="text-sm font-semibold text-pink-600">
                            Pontuação: {response.totalScore}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {response.isGoodDayForExercise
                            ? "Bom dia para se exercitar"
                            : "Recomendado descansar"}
                        </p>
                        <div className="inline-block bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                          {response.recommendedExerciseType}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
