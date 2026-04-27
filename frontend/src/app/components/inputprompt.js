import { useRouter } from "next/navigation";
import { useState } from "react";

const InputPrompt = () => {
    const [prompt, setPrompt] = useState('');
    const router = useRouter();
    const handleSubmit = () => {
        router.push(`/builder?data=${prompt}`);
    }
    return (
        <main className="relative mx-auto mt-14 flex w-full max-w-5xl flex-col items-center px-6">
            <div className="absolute -top-12 -z-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="absolute top-16 right-10 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-blue-100/50">
                <h1 className="text-center text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    What do you want to build?
                </h1>
                <p className="mt-3 text-center text-base text-slate-500">
                    Describe your app idea and generate a working interface instantly.
                </p>
            </div>
            <div className="mt-7 w-full max-w-3xl">
                <textarea
                    className="h-44 w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Build a personal finance dashboard with charts, recurring budgets, and spending insights..."
                    onChange={(e) => setPrompt(e.target.value)}>
                </textarea>
            </div>
            <div className="mt-6 w-full max-w-3xl">
                <button className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                >Submit</button>
            </div>
        </main>
    )
}

export default InputPrompt;
