import { useRouter } from "next/navigation";
import { useState } from "react";

const InputPrompt = () => {
    const [prompt, setPrompt] = useState('');
    const router = useRouter();
    const handleSubmit = () => {
        router.push(`/builder?data=${prompt}`);
    }
    return (
        <>
            <div className="w-full flex flex-col items-center mt-[22vh]">
                <h1 className="text-[44px]">What do you want to build</h1>
                <p className="mb-6 text-bolt-elements-textSecondary">Prompt, run, edit and deploy web-apps</p>
            </div>
            <div className="w-full flex flex-col items-center">
                <textarea
                    className="text-slate-300 text-lg font-medium bg-gray-900 focus:outline-none border-solid border-2 rounded border-indigo-500/75 w-96 h-40 text-black pl-4 pt-2 laceholder:italic placeholder:text-slate-400"
                    placeholder="How can we help you?"
                    onChange={(e) => setPrompt(e.target.value)}>
                </textarea>
            </div>
            <div className="w-full flex flex-col items-center mt-14">
                <button className="border border-2 border-slate-300 hover:border-slate-400 p-2 rounded-lg"
                    onClick={handleSubmit}
                >Submit</button>
            </div>
        </>
    )
}

export default InputPrompt;
