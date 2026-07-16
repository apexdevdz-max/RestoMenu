import { useRestaurant } from '../hooks/useRestaurant';
import RestaurantForm from '../components/settings/RestaurantForm';

export default function SettingsPage() {
  const { restaurant, loading, updateRestaurant } = useRestaurant();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-brand-dark">Paramètres</h1>
          <p className="text-sm text-brand-gray">Configurez votre restaurant</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 max-w-2xl">
          <div className="skeleton h-20 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
      ) : restaurant ? (
        <RestaurantForm restaurant={restaurant} onUpdate={updateRestaurant} />
      ) : (
        <div className="bg-white rounded-xl shadow-card p-8 text-center max-w-2xl">
          <p className="text-sm text-brand-gray">Restaurant non trouvé. Vérifiez la configuration Supabase.</p>
        </div>
      )}
    </div>
  );
}
