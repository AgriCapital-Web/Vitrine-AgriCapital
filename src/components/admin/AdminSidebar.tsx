import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, MessageSquare, Users, Image, Handshake, 
  Mail, Settings, FileText, Home, Send, Bell, Search, 
  Shield, TrendingUp
} from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: BarChart3, label: "Tableau de bord", path: "/admin/dashboard" },
  { icon: TrendingUp, label: "Analytiques", path: "/admin/analytics" },
  { icon: MessageSquare, label: "Témoignages", path: "/admin/testimonials" },
  { icon: Users, label: "Abonnés Newsletter", path: "/admin/newsletter" },
  { icon: Image, label: "Galerie d'images", path: "/admin/gallery" },
  { icon: Handshake, label: "Partenariats", path: "/admin/partnerships" },
  { icon: FileText, label: "Contenu du site", path: "/admin/content" },
  { icon: Send, label: "Messagerie", path: "/admin/messaging" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Search, label: "SEO", path: "/admin/seo" },
  { icon: Shield, label: "Utilisateurs", path: "/admin/users" },
  { icon: Settings, label: "Paramètres", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="AgriCapital" className="h-10 w-auto" />
          <div>
            <h1 className="font-bold text-foreground">AgriCapital</h1>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          Retour au site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
