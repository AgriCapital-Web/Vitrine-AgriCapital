import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare, Mail, Users, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'testimonial' | 'newsletter' | 'contact';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);
  const [newSubscribers, setNewSubscribers] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Fetch pending testimonials
    const { count: testimonialCount } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('approved', false);
    setPendingTestimonials(testimonialCount || 0);

    // Fetch recent subscribers (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: subscriberCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('subscribed_at', weekAgo.toISOString());
    setNewSubscribers(subscriberCount || 0);

    // Create notifications array
    const notifs: Notification[] = [];
    
    if (testimonialCount && testimonialCount > 0) {
      notifs.push({
        id: '1',
        type: 'testimonial',
        title: 'Témoignages en attente',
        message: `${testimonialCount} témoignage(s) en attente d'approbation`,
        date: new Date().toISOString(),
        read: false
      });
    }

    if (subscriberCount && subscriberCount > 0) {
      notifs.push({
        id: '2',
        type: 'newsletter',
        title: 'Nouveaux abonnés',
        message: `${subscriberCount} nouvel(aux) abonné(s) cette semaine`,
        date: new Date().toISOString(),
        read: false
      });
    }

    setNotifications(notifs);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'testimonial':
        return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'newsletter':
        return <Mail className="w-5 h-5 text-green-500" />;
      case 'contact':
        return <Users className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pendingTestimonials}</p>
                  <p className="text-sm text-muted-foreground">Témoignages en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{newSubscribers}</p>
                  <p className="text-sm text-muted-foreground">Nouveaux abonnés (7j)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Notifications actives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Aucune notification en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 rounded-lg ${
                      notif.read ? 'bg-muted/50' : 'bg-primary/5 border border-primary/20'
                    }`}
                  >
                    {getIcon(notif.type)}
                    <div className="flex-1">
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notif.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
