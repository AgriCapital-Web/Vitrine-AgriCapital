import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Building2, Users, Target } from "lucide-react";

const partnerships = [
  {
    id: 1,
    name: "Propriétaires Terriens",
    type: "Partenaire Foncier",
    description: "Mise à disposition de terres agricoles pour la création de plantations de palmiers à huile.",
    benefits: "Revenus passifs, valorisation du patrimoine foncier, développement local",
    status: "Actif",
    count: "150+"
  },
  {
    id: 2,
    name: "Petits Producteurs",
    type: "Partenaire Agricole",
    description: "Accompagnement technique et financier pour la production de palmier à huile.",
    benefits: "Formation, financement, garantie de rachat, encadrement technique",
    status: "Actif",
    count: "200+"
  },
  {
    id: 3,
    name: "Investisseurs",
    type: "Partenaire Financier",
    description: "Participation au financement des projets agricoles avec retour sur investissement.",
    benefits: "Rentabilité attractive, impact social, diversification de portefeuille",
    status: "Actif",
    count: "50+"
  },
  {
    id: 4,
    name: "Organismes de Développement",
    type: "Partenaire Institutionnel",
    description: "Collaboration avec les institutions pour le développement rural.",
    benefits: "Impact communautaire, développement durable, formation professionnelle",
    status: "En développement",
    count: "5+"
  },
];

const AdminPartnerships = () => {
  const [selectedPartnership, setSelectedPartnership] = useState<number | null>(null);

  return (
    <AdminLayout title="Gestion des Partenariats">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Handshake className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{partnerships.length}</p>
                  <p className="text-sm text-muted-foreground">Types de partenariats</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">150+</p>
                  <p className="text-sm text-muted-foreground">Propriétaires terriens</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">200+</p>
                  <p className="text-sm text-muted-foreground">Producteurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-muted-foreground">Investisseurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partnerships List */}
        <div className="grid gap-4">
          {partnerships.map((partnership) => (
            <Card 
              key={partnership.id} 
              className={`cursor-pointer transition-all ${
                selectedPartnership === partnership.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPartnership(
                selectedPartnership === partnership.id ? null : partnership.id
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold">{partnership.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        partnership.status === 'Actif' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {partnership.status}
                      </span>
                    </div>
                    <p className="text-sm text-primary">{partnership.type}</p>
                    <p className="text-muted-foreground">{partnership.description}</p>
                    
                    {selectedPartnership === partnership.id && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div>
                          <p className="text-sm font-medium">Avantages:</p>
                          <p className="text-sm text-muted-foreground">{partnership.benefits}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Partenaires actifs:</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{partnership.count}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary">{partnership.count}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> La gestion complète des partenariats (ajout, modification, suppression) 
              nécessite une intégration avec une base de données dédiée. Contactez le développeur pour 
              configurer cette fonctionnalité avancée.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPartnerships;
