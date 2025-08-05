import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Gamepad2, 
  MessageSquare, 
  Clock, 
  Settings, 
  Smartphone, 
  QrCode,
  Power,
  Rocket,
  History,
  Save,
  Check,
  Github,
  Play
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    commandPrefix: ".",
    defaultLanguage: "en",
    welcomeMessage: "",
    autoResponse: true
  });

  // Fetch bot settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/bot/settings"],
  });

  // Fetch game settings
  const { data: gameSettings, isLoading: gameSettingsLoading } = useQuery({
    queryKey: ["/api/games/settings"],
  });

  // Fetch WhatsApp status
  const { data: whatsappStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/whatsapp/status"],
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Fetch bot stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activity"],
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Fetch QR code
  const { data: qrData } = useQuery({
    queryKey: ["/api/whatsapp/qr"],
    enabled: whatsappStatus?.hasQR,
    refetchInterval: 3000,
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/bot/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Bot settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bot/settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  // Toggle game mutation
  const toggleGameMutation = useMutation({
    mutationFn: async ({ gameName, enabled }: { gameName: string; enabled: boolean }) => {
      return await apiRequest("PATCH", `/api/games/${gameName}/toggle`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update game setting.",
        variant: "destructive",
      });
    },
  });

  // WhatsApp connection mutations
  const connectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/whatsapp/connect", {});
    },
    onSuccess: () => {
      toast({
        title: "Connecting",
        description: "Initializing WhatsApp connection...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/status"] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/whatsapp/disconnect", {});
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "WhatsApp has been disconnected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/status"] });
    },
  });

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        commandPrefix: settings.commandPrefix || ".",
        defaultLanguage: settings.defaultLanguage || "en",
        welcomeMessage: settings.welcomeMessage || "",
        autoResponse: settings.autoResponse || true,
      });
    }
  }, [settings]);

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(formData);
  };

  const handleGameToggle = (gameName: string, enabled: boolean) => {
    toggleGameMutation.mutate({ gameName, enabled });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <MessageSquare className="text-whatsapp text-3xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bot Dashboard</h1>
                <p className="text-sm text-gray-500">by jeff_mitsuki</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  whatsappStatus?.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  whatsappStatus?.isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {whatsappStatus?.isConnected ? 'Connected to WhatsApp' : 'Disconnected'}
                </span>
              </div>
              
              {/* Language Selector */}
              <Select value={formData.defaultLanguage} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, defaultLanguage: value }))
              }>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="text-blue-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.activeUsers || "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Gamepad2 className="text-green-500 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Games Played</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.gamesPlayed || "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="text-yellow-500 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Messages Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.messagesCount || "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="text-red-500 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.uptime || "0%"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bot Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 text-blue-600" />
                  Bot Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Command Prefix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Command Prefix
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      className="w-16 text-center"
                      value={formData.commandPrefix}
                      onChange={(e) => setFormData(prev => ({ ...prev, commandPrefix: e.target.value }))}
                    />
                    <span className="text-sm text-gray-500">Commands will start with this character</span>
                  </div>
                </div>

                {/* Default Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <Select value={formData.defaultLanguage} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, defaultLanguage: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Welcome Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Message
                  </label>
                  <Textarea
                    className="h-24"
                    placeholder="Enter welcome message..."
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  />
                </div>

                {/* Auto-response */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.autoResponse}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoResponse: checked }))}
                  />
                  <span className="text-sm text-gray-700">Enable automatic responses</span>
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saveSettingsMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Game Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gamepad2 className="mr-2 text-green-500" />
                  Game Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameSettingsLoading ? (
                    <div className="col-span-2 text-center py-4">Loading games...</div>
                  ) : gameSettings?.map((game: any) => (
                    <div key={game.gameName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          {game.gameName === 'ticTacToe' ? 'Tic Tac Toe' :
                           game.gameName === 'emojiQuiz' ? 'Emoji Quiz' :
                           game.gameName === 'wordGuess' ? 'Mo Kache' :
                           game.gameName === 'riddles' ? 'Pwovèb Kase' : game.gameName}
                        </h3>
                        <Switch
                          checked={game.enabled}
                          onCheckedChange={(checked) => handleGameToggle(game.gameName, checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                      <p className="text-xs text-gray-500">
                        Command: <code className="bg-gray-100 px-1 rounded">{game.command}</code>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Check className="text-blue-500 mt-1 mr-2 h-4 w-4" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Smart Question Management</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Bot automatically avoids repeating questions in the same session and tracks user progress.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* WhatsApp Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 text-green-500" />
                  WhatsApp Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    whatsappStatus?.isConnected ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {whatsappStatus?.isConnected ? (
                      <Check className="text-green-500 text-2xl" />
                    ) : (
                      <Power className="text-red-500 text-2xl" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {whatsappStatus?.isConnected ? 'Connected' : 'Disconnected'}
                  </h3>
                  {whatsappStatus?.isConnected && whatsappStatus?.phoneNumber && (
                    <p className="text-sm text-gray-600 mb-4">+{whatsappStatus.phoneNumber}</p>
                  )}
                  
                  {/* QR Code */}
                  {whatsappStatus?.hasQR && qrData?.qrCode && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                      <img src={qrData.qrCode} alt="QR Code" className="mx-auto max-w-full h-auto" />
                      <p className="text-sm text-gray-500 mt-2">Scan to connect WhatsApp</p>
                    </div>
                  )}
                  
                  {!whatsappStatus?.isConnected && !whatsappStatus?.hasQR && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                      <QrCode className="text-gray-400 text-4xl mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Click connect to generate QR code</p>
                    </div>
                  )}
                  
                  {whatsappStatus?.isConnected ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => disconnectMutation.mutate()}
                      disabled={disconnectMutation.isPending}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => connectMutation.mutate()}
                      disabled={connectMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {connectMutation.isPending ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Setup Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="mr-2 text-orange-500" />
                  Quick Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Download from GitHub</p>
                      <p className="text-xs text-gray-500">Clone or download the repository</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deploy to Free Hosting</p>
                      <p className="text-xs text-gray-500">Use Railway, Render, or Replit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Connect WhatsApp</p>
                      <p className="text-xs text-gray-500">Scan QR code to link your number</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Configure Games</p>
                      <p className="text-xs text-gray-500">Enable/disable features as needed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-start">
                    <Smartphone className="text-orange-500 mt-1 mr-2 h-4 w-4" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-900">Android Setup</h4>
                      <p className="text-xs text-orange-700 mt-1">Complete setup guide available in README.md</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 text-purple-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activitiesLoading ? (
                    <div className="text-center py-4">Loading activities...</div>
                  ) : activities?.map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 text-green-500" />
              Game Preview - Tic Tac Toe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Sample game interaction in WhatsApp:</p>
                <div className="bg-gray-100 rounded-lg p-3 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-lg ml-auto max-w-xs text-right">
                      .tictactoe
                    </div>
                    <div className="bg-white border px-3 py-1 rounded-lg max-w-xs">
                      🎮 Tic Tac Toe Started!<br/>
                      You are X, I am O<br/><br/>
                      1️⃣2️⃣3️⃣<br/>
                      4️⃣5️⃣6️⃣<br/>
                      7️⃣8️⃣9️⃣<br/><br/>
                      Choose your position (1-9):
                    </div>
                    <div className="bg-green-500 text-white px-3 py-1 rounded-lg ml-auto max-w-xs text-right">
                      5
                    </div>
                    <div className="bg-white border px-3 py-1 rounded-lg max-w-xs">
                      1️⃣2️⃣3️⃣<br/>
                      4️⃣❌6️⃣<br/>
                      7️⃣8️⃣9️⃣<br/><br/>
                      My turn... I choose 1<br/><br/>
                      ⭕2️⃣3️⃣<br/>
                      4️⃣❌6️⃣<br/>
                      7️⃣8️⃣9️⃣<br/><br/>
                      Your turn!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Github className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm font-medium text-gray-900">WhatsApp Bot Project</p>
                <p className="text-xs text-gray-500">Created by <strong>jeff_mitsuki</strong></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">100% Free • No Cost Setup</p>
              <p className="text-xs text-gray-400">Mobile Friendly • GitHub Ready</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
