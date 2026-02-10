import { useState } from 'react'
import { Camera, Mail, User} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {

  const {authUser, isUpdatingProfile , updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader(); 
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
      await updateProfile({profilePic: base64Img});
    }
  }

  return (
    <div className=" pt-24 pb-10">
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <p>Mon profile</p>

        {/* avatar upload section */}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Téléversement..." : "Cliquer pour mettre à jour votre profile"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Noms D'utilisateur
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Adresse Électronique
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
          </div>
        </div>

        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium  mb-4">Autres Informations</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Votre dernière date de connexion</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Statut de votre compte</span>
              <span className="text-green-500">Actif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  )
}

export default ProfilePage