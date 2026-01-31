import { RegisterForm } from "@/components/forms/register-form";

export default function Register() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50 bg-grid-small-black/5">
             <div className="w-full max-w-[420px] bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="h-14 w-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                    </div>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
}