import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  Sparkles,
  TrendingUp,
  Award,
  Star,
  Timer,
  ArrowRight,
  Activity,
  Target,
  Zap,
  Eye,
  UserCheck,
  Rocket,
  Crown,
  PartyPopper,
  Heart,
  Coffee,
  Music
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      id: 'programs',
      title: 'Fitness Programs',
      description: 'Create and manage workout programs that inspire transformation',
      icon: Dumbbell,
      route: '/admin/programs',
      gradient: 'from-admin to-admin-glow',
      stats: 'Build Amazing Routines',
      emoji: '💪',
      features: ['Program Creation', 'Intensity Levels', 'Custom Icons']
    },
    {
      id: 'trainers',
      title: 'Trainer Management',
      description: 'Build your dream team of certified fitness professionals',
      icon: Users,
      route: '/admin/trainers',
      gradient: 'from-secondary to-admin2',
      stats: 'Manage Elite Team',
      emoji: '🏋️‍♂️',
      features: ['Trainer Profiles', 'Rating System', 'Bio Management']
    },
    {
      id: 'slots',
      title: 'Schedule Slots',
      description: 'Organize training sessions and availability windows',
      icon: Calendar,
      route: '/admin/slots',
      gradient: 'from-admin2 to-admin',
      stats: 'Time Organization',
      emoji: '📅',
      features: ['Time Management', 'Trainer Assignment', 'Session Duration']
    }
  ];

  const viewSections = [
    {
      id: 'view-trainers',
      title: 'View All Trainers',
      description: 'See all trainers with their schedules, programs, and availability',
      icon: Eye,
      route: '/admin/view_trainers',
      gradient: 'from-purple-500 to-pink-500',
      stats: 'Complete Overview',
      emoji: '👥',
      features: ['Trainer Profiles', 'Schedule Views', 'Program Lists']
    },
    {
      id: 'view-users',
      title: 'Community Members',
      description: 'Browse all registered users and their fitness journey',
      icon: UserCheck,
      route: '/admin/view_users',
      gradient: 'from-blue-500 to-cyan-500',
      stats: 'Member Directory',
      emoji: '🌟',
      features: ['User Profiles', 'Activity Stats', 'Membership Status']
    }
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Super Fun Hero Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-4">
            <div>
              <h1 className="text-6xl font-bold gradient-text animate-pulse-glow">
                🚀 Fitness Admin Hub 🎯
              </h1>
              <p className="text-xl text-muted-foreground mt-2 flex items-center justify-center gap-2">
                Your <Crown className="w-5 h-5 text-yellow-500" /> command center for fitness excellence <PartyPopper className="w-5 h-5 text-admin" />
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-4 bg-admin/10 rounded-xl hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-admin animate-bounce-gentle" />
              <span className="font-semibold text-admin">Goal Focused</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-admin2/10 rounded-xl hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-admin2 animate-bounce-gentle" />
              <span className="font-semibold text-admin2">High Energy</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-secondary/10 rounded-xl hover:scale-105 transition-transform">
              <Award className="w-5 h-5 text-secondary-foreground animate-bounce-gentle" />
              <span className="font-semibold text-secondary-foreground">Elite Quality</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-pink-100 rounded-xl hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-pink-600 animate-bounce-gentle" />
              <span className="font-semibold text-pink-600">Made with ❤️</span>
            </div>
          </div>

          {/* Fun Motivational Quote */}
          <div className="bg-gradient-to-r from-admin/10 to-admin2/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Coffee className="w-6 h-6 text-admin" />
              <Music className="w-6 h-6 text-admin2" />
            </div>
            <p className="text-lg font-medium text-center">
              "The best project you'll ever work on is <span className="gradient-text font-bold">YOU</span>!"
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              - Your Fitness Admin Dashboard 💪
            </p>
          </div>
        </div>

        {/* Management Sections */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold gradient-text mb-2">🛠️ Management Tools</h2>
            <p className="text-muted-foreground">Create, edit, and manage your fitness empire!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {adminSections.map((section, index) => (
            <Card 
              key={section.id} 
              className="fitness-card group hover:shadow-[var(--shadow-admin)] transition-all duration-500 hover:scale-105 hover:rotate-1 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="text-center space-y-4">
                <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    {section.title}
                    <span className="text-2xl animate-bounce-gentle">{section.emoji}</span>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {section.description}
                  </CardDescription>
                </div>

                <Badge variant="secondary" className="mx-auto">
                  <Star className="w-3 h-3 mr-1" />
                  {section.stats}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-2">
                  {section.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-admin" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleNavigation(section.route)}
                  className="w-full h-12 text-lg font-bold bg-admin text-admin-foreground border-2 border-admin-yellow hover:bg-admin-light hover:text-admin-foreground transition"
                >
                  <span>Manage {section.title.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* View Sections */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold gradient-text mb-2">👀 Overview Dashboard</h2>
            <p className="text-muted-foreground">Get the complete picture of your fitness community!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {viewSections.map((section, index) => (
              <Card 
                key={section.id} 
                className="fitness-card group hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:scale-105 hover:-rotate-1 animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 150}ms` }}
              >
                <CardHeader className="text-center space-y-4">
                  <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300 group-hover:animate-bounce-gentle`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                      {section.title}
                      <span className="text-2xl animate-bounce-gentle">{section.emoji}</span>
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {section.description}
                    </CardDescription>
                  </div>

                  <Badge variant="secondary" className="mx-auto">
                    <Star className="w-3 h-3 mr-1" />
                    {section.stats}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-2">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-admin animate-pulse-glow" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleNavigation(section.route)}
                  className="w-full h-12 text-lg font-bold bg-admin text-admin-foreground border-2 border-admin-yellow hover:bg-admin-light hover:text-admin-foreground transition"
                  >
                    <span>Explore {section.title.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Super Fun Quick Stats Dashboard */}
        <Card className="fitness-card animate-fade-in bg-gradient-to-br from-admin/5 to-admin2/5">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-admin animate-bounce-gentle" />
              🎉 Epic Dashboard Overview 🎉
              <Timer className="w-6 h-6 text-admin2 animate-bounce-gentle" />
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3 p-4 bg-admin/10 rounded-xl hover:scale-105 transition-transform">
                <div className="p-3 rounded-full bg-admin/20 w-fit mx-auto animate-bounce-gentle">
                  <Dumbbell className="w-6 h-6 text-admin" />
                </div>
                <div className="font-bold text-3xl gradient-text">Programs 💪</div>
                <div className="text-sm text-muted-foreground">Create unlimited fitness programs with custom intensity levels and beautiful icons</div>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-admin2/10 rounded-xl hover:scale-105 transition-transform">
                <div className="p-3 rounded-full bg-admin2/20 w-fit mx-auto animate-bounce-gentle">
                  <Users className="w-6 h-6 text-admin2" />
                </div>
                <div className="font-bold text-3xl" style={{ color: 'hsl(var(--admin2))' }}>Trainers 🏋️‍♂️</div>
                <div className="text-sm text-muted-foreground">Manage professional profiles, ratings, and availability for your fitness team</div>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-secondary/10 rounded-xl hover:scale-105 transition-transform">
                <div className="p-3 rounded-full bg-secondary/20 w-fit mx-auto animate-bounce-gentle">
                  <Calendar className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="font-bold text-3xl text-secondary-foreground">Schedules ⏰</div>
                <div className="text-sm text-muted-foreground">Organize time slots and sessions to maximize trainer-client connections</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Super Motivational Footer */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-xl">
            <span>Building the future of fitness</span>
            <span className="text-admin animate-bounce-gentle text-3xl">🚀</span>
            <span>one admin at a time</span>
          </div>
          <div className="bg-gradient-to-r from-admin/20 to-admin2/20 rounded-2xl p-6 max-w-3xl mx-auto">
            <p className="text-lg font-medium text-center mb-2">
              🌟 "Success is the sum of small efforts repeated day in and day out" 🌟
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Welcome to your fitness administration center. Each section is designed to help you create 
              an exceptional fitness experience for your clients and trainers. Let's make fitness fun! 💪
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <PartyPopper className="w-6 h-6 text-admin animate-bounce-gentle" />
              <Heart className="w-6 h-6 text-pink-500 animate-bounce-gentle" />
              <Crown className="w-6 h-6 text-yellow-500 animate-bounce-gentle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;