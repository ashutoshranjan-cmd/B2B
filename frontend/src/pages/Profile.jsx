
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Building2, Mail, Phone, User, CheckCircle, ExternalLink, FileText, Shield } from "lucide-react";
import { getCurrentUser,getMyCompany } from "../services/auth.api";

export default function Profile() {
    const { token } = useAuth();

    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userRes = await getCurrentUser();

                const fetchedUser = userRes.data;
                setUser(fetchedUser);

                // ✅ 2️⃣ FETCH COMPANY ONLY IF ONBOARDING COMPLETED
                if (fetchedUser.onboardingCompleted) {
                    const companyRes = await getMyCompany();
                    setCompany(companyRes.data.company);
                }
            } catch (err) {
                // console.error(err);
                // setError("Failed to load profile data"); 
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token,user?.onboardingCompleted]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-slate-700 text-lg">User not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Profile</h1>
                    <p className="text-slate-600">Manage your business information and settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                                    <User className="w-10 h-10" />
                                </div>
                                <h2 className="text-xl font-semibold text-center">{user.name}</h2>
                                <p className="text-blue-100 text-sm text-center mt-1 capitalize">{user.role}</p>
                            </div>

                            {/* User Details */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                                        <p className="text-sm text-slate-900 break-all">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                                        <p className="text-sm text-slate-900">{user.phone}</p>
                                    </div>
                                </div>

                                {user.onboardingCompleted && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Verified Seller</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Company Info / Onboarding */}
                    <div className="lg:col-span-2">
                        {/* ❌ ONBOARDING NOT COMPLETED */}
                        {!user.onboardingCompleted && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                <div className="text-center max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        Complete Seller Onboarding
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Set up your company profile to start selling on our B2B platform. Add your business details and get verified.
                                    </p>
                                    <Link
                                        to="/become-seller"
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                                    >
                                        <Building2 className="w-5 h-5" />
                                        Start Onboarding
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ✅ COMPANY INFO */}
                        {user.onboardingCompleted && company && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                {/* Company Header */}
                                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">{company.companyName}</h2>
                                                <p className="text-slate-300 text-sm">{company.businessType}</p>
                                            </div>
                                        </div>
                                        {company.isVerified && (
                                            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 px-3 py-1.5 rounded-full">
                                                <Shield className="w-4 h-4 text-green-300" />
                                                <span className="text-sm font-medium text-green-100">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Company Details */}
                                <div className="p-6 space-y-6">
                                    {company.description && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-slate-400" />
                                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Description</p>
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">{company.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">Business Type</p>
                                            <p className="text-slate-900 font-medium">{company.businessType}</p>
                                        </div>

                                        {company.gstNumber && (
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">GST Number</p>
                                                <p className="text-slate-900 font-mono text-sm">{company.gstNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100 pt-6">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3 font-medium">Store Link</p>
                                        <Link
                                            to={`/store/${company.subDomain
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors group"
                                        >
                                            <span className="font-medium text-sm">
                                               `/store/{company.subDomain
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`
                                            </span>
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>

                                    {!company.isVerified && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex gap-3">
                                                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-amber-900 mb-1">
                                                        Product Verification Pending
                                                    </p>
                                                    <p className="text-sm text-amber-700">
                                                        Your company profile is under review. You'll be notified once verification is complete.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}