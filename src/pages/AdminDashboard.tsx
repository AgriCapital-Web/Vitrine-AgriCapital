import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, Mail, Users, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface PageVisit {
  page_path: string;
  visit_count: number;
}

const AdminDashboard = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [weekVisits, setWeekVisits] = useState(0);
  const [topPages, setTopPages] = useState<PageVisit[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchAnalytics(), fetchNewsletter(), fetchTestimonials()]);
  };

  const fetchTestimonials = async () => {
    const { count: total } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });
    setTestimonialCount(total || 0);

    const { count: pending } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('approved', false);
    setPendingTestimonials(pending || 0);
  };

  const fetchNewsletter = async () => {
    const { count } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });
    setNewsletterCount(count || 0);
  };

  const fetchAnalytics = async () => {
    // Total visits
    const { count: total } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true });
    setTotalVisits(total || 0);

    // Today visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    setTodayVisits(todayCount || 0);

    // Week visits
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: weekCount } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());
    setWeekVisits(weekCount || 0);

    // Top pages
    const { data: visits } = await supabase
      .from('page_visits')
      .select('page_path');
    
    if (visits) {
      const pageCount: Record<string, number> = {};
      visits.forEach(v => {
        pageCount[v.page_path] = (pageCount[v.page_path] || 0) + 1;
      });
      const sorted = Object.entries(pageCount)
        .map(([page_path, visit_count]) => ({ page_path, visit_count }))
        .sort((a, b) => b.visit_count - a.visit_count)
        .slice(0, 10);
      setTopPages(sorted);
    }
  };

  return (
    <AdminLayout title="Tableau de Bord">
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visiteurs Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalVisits.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cette Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{weekVisits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{todayVisits} aujourd'hui</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Abonnés Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{newsletterCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Témoignages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{testimonialCount}</p>
              {pendingTestimonials > 0 && (
                <p className="text-xs text-amber-500">{pendingTestimonials} en attente</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Pages les Plus Visitées
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Aucune donnée disponible</p>
              ) : (
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={page.page_path} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{page.page_path || '/'}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{page.visit_count} visites</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{todayVisits} visiteurs aujourd'hui</p>
                    <p className="text-xs text-muted-foreground">Trafic du site</p>
                  </div>
                </div>
                {pendingTestimonials > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">{pendingTestimonials} témoignage(s) en attente</p>
                      <p className="text-xs text-muted-foreground">À valider</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{newsletterCount} abonnés</p>
                    <p className="text-xs text-muted-foreground">Newsletter active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
