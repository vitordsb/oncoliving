import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function QuizPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Get active quiz
  const { data: quiz, isLoading: quizLoading } = trpc.quizzes.getActive.useQuery();

  // Submit response mutation
  const submitMutation = trpc.responses.submitDaily.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setSubmitted(true);
    },
    onError: (error: any) => {
      toast.error(error.message || "Falha ao enviar o questionário");
    },
  });

  if (quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Nenhum questionário ativo</h3>
                  <p className="text-amber-800 mb-4">
                    Seu oncologista ainda não ativou um questionário.
                  </p>
                  <Button onClick={() => navigate("/")} variant="outline">
                    Voltar para o painel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = answers[currentQuestion?.id] !== undefined;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Responda todas as perguntas antes de enviar");
      return;
    }

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      answerValue: answers[q.id],
    }));

    submitMutation.mutate({
      quizId: quiz.id,
      answers: formattedAnswers,
    });
  };

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-6">
          {/* Medical Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">
                  <strong>Importante:</strong> Esta recomendação é baseada nas suas respostas e não
                  substitui as orientações do seu oncologista.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {result.isGoodDayForExercise ? (
                  <div className="text-6xl">💪</div>
                ) : (
                  <div className="text-6xl">🌿</div>
                )}
              </div>
              <CardTitle className="text-3xl">
                {result.isGoodDayForExercise ? "Ótimo dia para se exercitar!" : "Recomendado descansar hoje"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-pink-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Atividade recomendada</p>
                <p className="text-2xl font-bold text-pink-600">
                  {result.recommendedExerciseType}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Sua pontuação de bem-estar</p>
                <p className="text-4xl font-bold text-gray-900">{result.totalScore}</p>
              </div>

              <Button
                onClick={() => navigate("/")}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg font-semibold"
              >
                Voltar para o painel
              </Button>

              <Button
                onClick={() => navigate("/exercises")}
                variant="outline"
                className="w-full py-6 text-lg"
              >
                Ver biblioteca de exercícios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Medical Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Importante:</strong> Esta avaliação ajuda a personalizar recomendações de
                exercícios. Sempre siga as orientações do seu oncologista.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-900">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion?.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion?.questionType === "YES_NO" && (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAnswer("YES")}
                  variant={answers[currentQuestion.id] === "YES" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                >
                  Sim
                </Button>
                <Button
                  onClick={() => handleAnswer("NO")}
                  variant={answers[currentQuestion.id] === "NO" ? "default" : "outline"}
                  className="flex-1 py-6 text-lg"
                >
                  Não
                </Button>
              </div>
            )}

            {currentQuestion?.questionType === "SCALE_0_10" && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 (Baixo)</span>
                  <span>10 (Alto)</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleAnswer(num.toString())}
                      variant={
                        answers[currentQuestion.id] === num.toString()
                          ? "default"
                          : "outline"
                      }
                      className="py-6 text-lg font-semibold"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion?.questionType === "MULTIPLE_CHOICE" && (
              <div className="space-y-2">
                {currentQuestion?.options?.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => handleAnswer(option.scoreValue)}
                    variant={
                      answers[currentQuestion.id] === option.scoreValue
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start py-6 text-lg"
                  >
                    {answers[currentQuestion.id] === option.scoreValue && (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {option.text}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1 py-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || submitMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
            >
              {submitMutation.isPending ? "Enviando..." : "Enviar questionário"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!isAnswered}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg font-semibold"
            >
              Próxima
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
