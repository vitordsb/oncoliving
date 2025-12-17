import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, LogOut, Users, ClipboardList, Dumbbell } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: patients = [], isLoading: patientsLoading } = trpc.patients.list.useQuery();
  const { data: quizzes = [], isLoading: quizzesLoading } = trpc.quizzes.list.useQuery();
  const { data: exercises = [], isLoading: exercisesLoading } = trpc.exercises.list.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user || user.role !== "ONCOLOGIST") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-green-50">
        <Card className="max-w-md border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Acesso negado</h3>
                <p className="text-amber-800 mb-4">
                  Esta página está disponível apenas para oncologistas.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                  Voltar para o início
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Movimento para Cura</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {user.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Medical Disclaimer */}
        <Card className="border-amber-200 bg-amber-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Importante:</strong> Este painel serve para configurar questionários e
                acompanhar o progresso dos pacientes. As recomendações são ferramentas de apoio e não
                substituem consulta médica.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de pacientes</p>
                  <p className="text-3xl font-bold text-pink-600">
                    {patientsLoading ? "..." : patients.length}
                  </p>
                </div>
                <Users className="w-12 h-12 text-pink-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Questionários ativos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {quizzesLoading ? "..." : quizzes.filter((q) => q.isActive).length}
                  </p>
                </div>
                <ClipboardList className="w-12 h-12 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Biblioteca de exercícios</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {exercisesLoading ? "..." : exercises.length}
                  </p>
                </div>
                <Dumbbell className="w-12 h-12 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="quizzes">Questionários</TabsTrigger>
            <TabsTrigger value="exercises">Exercícios</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Gerenciamento de pacientes</CardTitle>
                <CardDescription>
                  Veja e gerencie seus pacientes. Clique em um paciente para ver histórico e perfil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patientsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  </div>
                ) : patients.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Nenhum paciente ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/admin/patients/${patient.id}`)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar questionários</CardTitle>
                  <CardDescription>Crie e gerencie questionários diários para seus pacientes.</CardDescription>
                </div>
                <Button className="bg-pink-500 hover:bg-pink-600">Criar questionário</Button>
              </div>
            </CardHeader>
              <CardContent>
                {quizzesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  </div>
                ) : quizzes.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Nenhum questionário ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{quiz.name}</p>
                          <p className="text-sm text-gray-600">{quiz.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: {quiz.isActive ? "Ativo" : "Inativo"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-pink-700 border-pink-200"
                          onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                        >
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Biblioteca de exercícios</CardTitle>
                    <CardDescription>Gerencie tutoriais e recomendações de exercícios.</CardDescription>
                  </div>
                  <Button className="bg-pink-500 hover:bg-pink-600">Adicionar exercício</Button>
                </div>
              </CardHeader>
              <CardContent>
                {exercisesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  </div>
                ) : exercises.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No exercises yet.</p>
                ) : (
                  <div className="space-y-2">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{exercise.name}</p>
                          <p className="text-sm text-gray-600">{exercise.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Intensidade: {exercise.intensityLevel}
                          </p>
                        </div>
                        <Button variant="outline" className="text-pink-700 border-pink-200">
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
